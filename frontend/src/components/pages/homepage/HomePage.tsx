import {  apiService, BURL } from "@/services/api";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import {  ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { MacbookScrollDemo } from "./MacbookScrollDemo";
import ace from "../../../assets/ace.png"
import shad from "../../../assets/shadcn.png"
import { Spotlight } from "@/components/ui/Spotlight";



// Define the styles outside the component
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes drift {
      0% { transform: translate(0, 0); }
      50% { transform: translate(50px, 20px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes drift-slow {
      0% { transform: translate(0, 0); }
      50% { transform: translate(-30px, -20px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes draw {
      to { stroke-dashoffset: 0; }
    }
    @keyframes gradient-x {
      0% { background-position: 0% 100%; }
      50% { background-position: 100% 90%; }
      100% { background-position: 0% 100%; }
    }
    .animate-drift {
      animation: drift 20s ease-in-out infinite;
    }
    .animate-drift-slow {
      animation: drift-slow 25s ease-in-out infinite;
    }
    .animate-draw {
      animation: draw 1s ease-out forwards;
    }
    .animate-gradient-x {
      background-size: 200% 100%;
      animation: gradient-x 15s ease infinite;
    }
    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
    }
    .animate-fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}} />
);

export const HomePage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [status , setStatus] = useState('Offline')
  const [isOnline, setIsOnline] = useState(false)
  // const [isHovered, setIsHovered] = useState(false);

  useEffect(()=> {
    fetch(BURL)
    .then((res) => {
      res.json()
    })
    .then((data) => {
      console.log(data);

      setStatus('Online')
      setIsOnline(true)
    })
    .catch(e => {
      console.log(e)
      setStatus('Offline')
      setIsOnline(false)
    })

  } , [])

  return (
    <>
      <GlobalStyles />

      <div className="min-h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div
          className="absolute inset-0 -z-10 transform-gpu"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgb(var(--primary) / 0.05) 0%, transparent 70%)`,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-drift-slow" />
        </div>


      <nav className="absolute top-0 w-full p-6 animate-fade-in">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold hover:text-purple-400 scroll-smooth">
              ProfilesMe
            </div>
            <div className="flex items-center gap-4">
            <Button
                  onClick={apiService.googleLogin}
                  className="bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 h-12"
                >
                  {/* <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /> */}

                  {/* <img
                    src="/api/placeholder/18/18"
                    alt="Google"
                    className="mr-2 h-4 w-4"
                  /> */}
                  Sign in
                </Button>
            </div>
          </div>
        </nav>

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="top-24 p-4 max-w-7xl  mx-auto relative z-10 w-full  md:pt-0 animate-fadeFromBelow ">

        <h1 className="text-7xl md:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Build a 'One' profile<br /> for all.

        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        Create a beautiful, easy-to-share profile with your social links in one place.

        </p>
        {/* <p className="text-xl text-muted-foreground max-w-lg mx-auto animate-fade-in-up delay-200">
              </p> */}
              <div
              className="flex flex-col gap-8 items-center pt-4"

            >

                    {/* <span className="backdrop-blur-sm bg-gradient-to-r from-cyan-200 to-purple-700/30 p-2 rounded-md font-semibold text-white justify-center items-center">Status: Server {status}</span> */}
                    <span className={`

                      backdrop-blur-sm
                    ${isOnline ? 'bg-green-600' : 'bg-gray-600 p-1'}
                     rounded-md text-sm font-mono
                      text-white justify-center
                      items-center
                      `}>Status: Backend {status}</span>
              {/* Input and buttons group */}
              <Card className={`
  p-3 backdrop-blur-lg bg-gradient-to-r from-purple-900/70 via-cyan-200/50 to-gray-800/70
  border border-white/30 shadow-xl flex items-center gap-3 max-w-2xl
  transform transition-all duration-500
  rounded-lg
`}>

                <div className="flex-1 relative">

                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Get your username"
                    className="pl-7 h-12 bg-black/50 backdrop-blur-sm border-none"
                  />
                </div>
                {/* <Button
                  onClick={() => window.location.href = `/${username}`}
                  className={`
                    group bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground
                    transition-all duration-300 h-12
                    ${!username ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={!username}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button> */}
                <Button
                  onClick={apiService.googleLogin}
                  className="bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 h-12"
                >
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />

                  {/* <img
                    src="/api/placeholder/18/18"
                    alt="Google"
                    className="mr-2 h-4 w-4"
                  /> */}
                  Lets Go
                </Button>
              </Card>

              <div className="text-gray-400 text-center">
    <div className="text-sm font-bold mb-4 opacity-65">
        Built with
        <div className="flex justify-center items-center space-x-4 mt-2">
            <img src={ace} className="h-9 w-auto " />
            <img src={shad} className="h-9 w-auto " />
        </div>
    </div>
</div>
             <MacbookScrollDemo />


              <div className="relative md:top-24 top-12 container mx-auto px-4 text-center -mt-11">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Your Profile URL Goes By:
        </h2>
        <div className="bg-white border border-cyan-100 rounded-xl shadow-md inline-block px-6 py-3">
          <span className="text-1xl font-medium">
            <span className="text-cyan-600">profilesme.site/</span>
            <span className="text-purple-600 font-bold">"YourUsername"</span>
          </span>
        </div>


      </div>
      <div className="relative md:top-12 top-6 flex items-center justify-center min-h-10 pt-6 px-4">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
    {[
      {
        icon: "🔗",
        label: "One Link",
        des: "One link for all your destination links to show your online presence, JUST ONE!",
      },
      {
        icon: "✨",
        label: "Beautiful Design",
        des: "Beautiful design with customizable background and profile to showcase your links.",
      },
      {
        icon: "📊",
        label: "Analytics",
        des: "Total Visitor count for a better reach and analysing.",
      },
    ].map((feature, index) => (
      <div
        key={index}
        className={`
          p-4 rounded-xl bg-white/5 backdrop-blur-sm
          border border-white/10 hover:bg-white/10
          transition-all duration-300 transform
          hover:scale-105 cursor-pointer
          flex flex-col items-center gap-2
          animate-fade-in-up
        `}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <span className="text-2xl">{feature.icon}</span>
        <span className="text-sm font-medium">{feature.label}</span>
        <span className="text-xs text-center">{feature.des}</span>
      </div>
    ))}
  </div>
</div>


              {/* <div className="relative w-full h-[80vh] overflow-hidden">
  <img src={image} alt="Image" className="w-full h-full object-cover opacity-100 transition-opacity duration-1000 ease-out hover:opacity-100" />
</div>
 */}


              {/* Features */}

            </div>
      </div>
    </div>


      {/* <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background">


        <div className="min-h-screen flex flex-col justify-center items-center px-4 mt-24"  >
          <div className="w-full max-w-3xl mx-auto text-center space-y-12 animate-fade-in-up">

            <div className="space-y-6">
              <h1 className="text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent ">
                  Build a 'ONE' profile
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  for all.

                </span>
              </h1>

            </div>



          </div>
        </div>



      </div> */}


    </>
  );
};