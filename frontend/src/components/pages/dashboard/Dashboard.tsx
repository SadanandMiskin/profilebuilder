import React, { useEffect, useState } from 'react';
import {
  User,
  Link as LinkType,
  LinkFormData,
} from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { API_URL, apiService, AUTH } from '@/services/api';
import UsernameSetup from './UsernameSetup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Menu, Plus, Trash2, Link,  LogOut, Edit,  } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LinkForm from '../../LinkForm';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProfileSettings } from './ProfileSettings';
// import { Toaster } from '@/components/ui/toaster';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { SOCIAL_PLATFORMS, SocialLinkForm } from './SocialLinkForm';
import LiveLink from './LiveLink';
// import { platform } from 'os';



export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [usernameSet, setUsernameSet] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        setIsLoading(true);
        console.log('trrrrrrrrrr')
        const response = await fetch(AUTH, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('afterrrr')
        const userData = await response.json();
        setUser(userData);
        setUsernameSet(!!userData.username);
        const userLinks = await apiService.getUserLinks(userData.id);
        setLinks(userLinks);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // return () => {
      fetchUserData();
    // }
  }, []);

  const handleAddLink = async (linkData: LinkFormData) => {

    if (!user) return;
    try {
    setIsLoading(true);
      const newLink = await apiService.createLink({
        userId: user.id,
        ...linkData
      });
      setLinks([...links, newLink]);
      toast({
        title: "Success",
        description: "Link added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add link",
        variant: "destructive"
      });
    }finally{
    setIsLoading(false);

    }

    window.location.href ="/dashboard"
  };

  const handleDeleteLink = async (id: number) => {
    setIsLoading(true);

    try {
      await apiService.deleteLink(id);
      setLinks(links.filter(link => link.id !== id));
      toast({
        title: "Success",
        description: "Link deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive"
      });
    }finally{
    setIsLoading(false);

    }

  };

  const handleUpdateLink = async (id: number, linkData: LinkFormData) => {
    try {
      setIsLoading(true)
      const updatedLink = await apiService.updateLink(id, linkData);
      setLinks(links.map(link => link.id === id ? updatedLink : link));
      toast({
        title: "Success",
        description: "Link updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive"
      });
    }finally{
    setIsLoading(false);
    }
    window.location.href ="/dashboard"

  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);

    try {
      await apiService.reorderLinks(user!.id, newLinks.map(link => link.id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder links",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token');
      if (!user?.username) {
        toast({
          title: "Error",
          description: "Username not set, unable to update profile.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_URL}/users/${user.username}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
    finally{
      setIsLoading(false)
    }
    window.location.href ="/dashboard"

  };

  function handleLogout() {
    localStorage.removeItem('token');
    toast({
      title: 'Logged out',
      description: "You have successfully logged out."
    });
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertDescription>
            Please log in to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!usernameSet) {
    return <UsernameSetup onUsernameSet={(username) => {
      setUser({ ...user, username });
      setUsernameSet(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-600">
      <div className="w-full bg-white dark:bg-black shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">ProfilesMe Dashboard</h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-gray-300 dark:hover:text-white bg-red-700 hover:bg-red-900"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}

          <Card className="lg:col-span-1">
            <CardHeader className="space-y-1">
            <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm text-center">
  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visits to your profile</h3>
  <p className="mt-1 text-lg font-bold text-blue-500 dark:text-blue-400">{user.totalVisit}</p>
</div>

              <CardTitle className="text-2xl">Profile</CardTitle>

              <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                  {user.profileImage ? (
                           <img
                                src={user.profileImage}
                                alt={user.username?.[0]?.toUpperCase() || 'User'}
                                className="h-full w-full rounded-full border-2 border-primary object-cover"
                                    />
                            ) : (
                          <span>{user.username?.[0]?.toUpperCase() || 'U'}</span>
                                  )}
                 </div>

                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  {/* <Link to={`/${user.username}`}>



                  </Link> */}
                  <LiveLink username={user.username} />

                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileSettings
                user={user}
                onUpdateProfile={handleUpdateProfile}
              />
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">Social Links</CardTitle>
              <p className="text-sm text-gray-500">
                Connect your profiles across platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {SOCIAL_PLATFORMS.map((platform) => {
  const existingLink = links.find(link =>
    (link.url?.includes(platform.baseUrl) || false) || // Add null check for url
    (link.title?.toLowerCase() === platform.name.toLowerCase())
  );

  return (
    <Dialog>
    <DialogTrigger asChild>
      <div
        key={platform.id}
        className="relative group p-4 rounded-lg border bg-black dark:bg-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-pink-500 dark:bg-gray-700">
            <platform.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{platform.name}</h3>
            {existingLink && existingLink.url ? (
              <a
                href={existingLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-600 truncate block"
              >
                {existingLink.url}
              </a>
            ) : (
              <span className="text-sm text-black-500">Not connected</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit {platform.name} Link</DialogTitle>
      </DialogHeader>
      <SocialLinkForm
        platform={platform}
        currentLink={existingLink}
        onSubmit={(linkData) => {
          if (existingLink) {
            handleUpdateLink(existingLink.id, linkData);
          } else {
            handleAddLink(linkData);
          }
        }}
      />
    </DialogContent>
  </Dialog>

  );
})}
              </div>
            </CardContent>
          </Card>



{/* Custom Links Section */}
<Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">Custom Links</CardTitle>
              <p className="text-sm text-gray-500">
                Add and manage your own personalized links
              </p>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="customLinks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {links.map((link, index) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="relative p-4 rounded-lg border bg-white dark:bg-gray-800 flex items-center justify-between hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <Link className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                <div>
                                  <h3 className="font-medium">{link.title}</h3>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:text-blue-600 truncate block"
                                  >
                                    {link.url}
                                  </a>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Menu className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogTitle></DialogTitle>

                                  </DialogContent>
                                     </Dialog>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteLink(link.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem
                                    onClick={() => {
                                      // Trigger reordering logic if needed
                                    }}
                                  >
                                    <MoveVertical className="mr-2 h-4 w-4" />
                                    Reorder
                                  </DropdownMenuItem> */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 w-full flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Custom Link</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Link</DialogTitle>
                  </DialogHeader>
                  <LinkForm
                    onSubmit={(linkData) => handleAddLink(linkData)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Dashboard