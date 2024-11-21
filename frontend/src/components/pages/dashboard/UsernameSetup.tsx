import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "../../../hooks/use-toast";
import { API_URL } from '@/services/api';

interface UsernameSetupProps {
  onUsernameSet: (username: string) => void;
}

const UsernameSetup: React.FC<UsernameSetupProps> = ({ onUsernameSet }) => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      if (!username || username.length < 3) {
        toast({
          title: "Invalid Username",
          description: "Username must be at least 3 characters long",
          variant: "destructive"
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "No authentication token found.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_URL}/users/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (data.exists) {
        toast({
          title: "Username Taken",
          description: "This username is already in use. Please choose another.",
          variant: "destructive"
        });
        return;
      }

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || 'Failed to set username',
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Username set successfully!",
        variant: "default"
      });

      onUsernameSet(username);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set username",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
      <h1 className="text-6xl font-bold mb-12">Before You Start</h1>
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-500/50 backdrop-blur-sm rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Choose Your Username</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              placeholder="Enter a unique username"
              required
              minLength={3}
              disabled={isChecking}
              className="bg-black"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Set Username"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernameSetup;