let stream = null // Init stream var for global use
const constraints = {
    audio: true,
    video: true,
}

export const getMicAndCamera = async() => {

    try{
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    }catch{
        console.log("user denied access to constraints")
    }
};
