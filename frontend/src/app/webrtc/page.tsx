'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import React, { useState } from 'react';

export default function WebRTC() {
    const [widthVid, setWidthVid] = useState<number>(1280);
    const [heightVid, setHeightVid] = useState<number>(720);
  
    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidthVid(Number(e.target.value));  
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeightVid(Number(e.target.value));  
    };

    return (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <div className="buttons col-span-1 flex flex-col space-y-2">
                {/* Share Mic and Camera Button */}
                <Button className="w-full">Share my mic and camera</Button>

                {/* Show and Stop Video Buttons */}
                <Button className="w-full">Show My Video</Button>
                <Button className="w-full">Stop My Video</Button>

                {/* Change Screen Size */}
                <Button className="w-full">Change Screen Size</Button>

                {/* Change Screen Size Inputs */}
                <div className="flex flex-col space-y-2">
                    <Input 
                        type="text" 
                        value={widthVid.toString()} 
                        onChange={handleWidthChange} 
                        placeholder="Width" 
                    />
                    <Input 
                        type="text" 
                        value={heightVid.toString()} 
                        onChange={handleHeightChange} 
                        placeholder="Height" 
                    />
                </div>

                {/* Start/Stop/Play Recording */}
                <div className="space-y-2">
                    <Button className="w-full">Start Recording</Button>
                    <Button className="w-full">Stop Recording</Button>
                    <Button className="w-full">Play Recording</Button>
                </div>

                {/* Share Screen Button */}
                <Button className="w-full">Share Screen</Button>

                {/* Dropdown for Audio/Video Inputs */}
                <div className="space-y-2">
                    <div>
                        <label>Select Audio Input: </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="btn-secondary w-full">Audio Input</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Select Device</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <label>Select Audio Output: </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="btn-secondary w-full">Audio Output</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Select Device</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <label>Select Video Input: </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="btn-secondary w-full">Video Input</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Select Device</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Video Feeds Section */}
            <div className="videos col-span-3">
                <div className="space-y-4">
                    <h3>My Feed</h3>
                    <video id="my-video" className="w-full" autoPlay controls playsInline />
                </div>
                <div className="space-y-4 mt-4">
                    <h3>Their Feed</h3>
                    <video id="other-video" className="w-full" autoPlay playsInline />
                </div>
            </div>
        </div>
    );
}


