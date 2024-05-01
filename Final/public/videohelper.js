function videoOnClick() {
        const videos = document.getElementById('videos');
                videos.forEach(video => {
        video.addEventListener('click', toggleFullScreen);
    });
}

function toggleFullScreen(e) {
    console.log("clicked!")
    let video = e.target;  
    if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) { /* Safari */
            video.webkitRequestFullscreen();
        } 
    } else if (document.fullscreenElement === video) {
        // Exit fullscreen only if the clicked video is in fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } 
    }
}