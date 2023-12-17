# Front_End_Task
 

- [Description](#description)
- [Samples](#samples)
- [Implementation Details](#implementation-details)
    - [Solution](#solution)


## Description
Front-end Task.

## Samples
![Demo Sample](https://github.com/Sandra-Essa/Front_End_Task/blob/main/Front%20End%20Task.gif)


## Implementation Details

### Solution
After that we started the implementation with the help of the provided examples in the docs.

This function is designed to play frames in synchronization and pause when clicked again.
```javaScript
const playPause = () => {
  isPlaying = !isPlaying;
  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;

  if (isPlaying) {
    animationInterval = setInterval(() => {
      frameIndex = (frameIndex + 1) % numFrames;
      const currentKey = frameKeys[frameIndex];
      updateFrame(currentKey);
      updateProgress();
    }, 1000 /3);
  } else {
    clearInterval(animationInterval);
    // Store the paused frame index
    pausedFrameIndex = frameIndex;
  }
};


```

This is used to showcase players on the playing field and initiate their starting positions.

```javaScript

const players = svg
.selectAll('.player')
.data(frame.detections)
.enter()
.append('circle')
.attr('class', 'player')
.attr('cx', d => d.x * 7+60) // Adjust the multiplier as needed for the desired spacing
.attr('cy', d => d.y * 7+50) // Adjust the multiplier as needed for the desired spacing
.attr('r', 7)
.attr('fill', d => d.color)
.on('mouseover', function (event, d) {
  showTooltip(d);
})
.on('mouseout', hideTooltip);

```

This function is designed to facilitate the display and concealment of information for each element.

```javaScript
function showTooltip(d) {
    console.log("Player Data:", d);
  
    const tooltip = d3.select('#tooltip');
    tooltip
      .style('display', 'block')
      .html(`
        Role: ${d.label !== undefined ? d.label : 'N/A'}<br>
        ID: ${d.id !== undefined ? d.id : 'N/A'}<br>
        Team: ${d.team !== undefined ? d.team : 'N/A'}<br>
        Position: (${d.x !== undefined ? d.x.toFixed(2) : 'N/A'}, ${d.y !== undefined ? d.y.toFixed(2) : 'N/A'})<br>
        Speed: ${d.speed !== undefined ? d.speed : 0}
      `);
  
    console.log("Player ID:", d.id);
    console.log("Player role:", d.label);
    console.log("Player role:", d.team);
  }
  
    function hideTooltip() {
      const tooltip = d3.select('#tooltip');
      tooltip.style('display', 'none');
    }
  } else {
    console.warn(`Invalid frame or detections data for frame ${key}. No players displayed.`);
  }
```
These functions are intended for navigating to the next and previous frames using buttons.

```javaScript
function nextFrame() {
  if (!data) {
    console.warn('Data is not loaded yet.');
    return;
  }

  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;

  // If the animation is paused and a specific frame is stored, proceed from that frame
  if (!isPlaying && pausedFrameIndex !== null) {
    frameIndex = pausedFrameIndex;
    pausedFrameIndex = null;
  } else {
    // Proceed to the next frame as before
    frameIndex = (frameIndex + 1) % numFrames;
  }

  const nextKey = frameKeys[frameIndex];
  updateFrame(nextKey);
  updateProgress();
}

function prevFrame() {
  if (!data) {
    console.warn('Data is not loaded yet.');
    return;
  }

  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;

  // If the animation is paused and a specific frame is stored, move to the previous frame
  if (!isPlaying && previousFrameIndex !== null) {
    frameIndex = previousFrameIndex;
    previousFrameIndex = null;
  } else {
    // Move to the previous frame as before
    frameIndex = (frameIndex - 1 + numFrames) % numFrames;
  }

  const prevKey = frameKeys[frameIndex];
  updateFrame(prevKey);
  updateProgress();
}
```

These functions are designed to update the progress bar, allowing real-time interaction with it while playing and dynamically updating its status.

```javaScript
function updateProgress() {
  const progress = document.getElementById('progress');
  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;

  // Calculate the progress percentage
  const progressPercentage = ((frameIndex + 1) / numFrames) * 100;

  // Update the value and style of the progress bar
  progress.value = progressPercentage;
  progress.style.backgroundImage = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${progressPercentage}%, #ddd ${progressPercentage}%, #ddd 100%)`;
}

// Function to update the player position based on the progress bar value
function updatePlayerPosition() {
  const progress = document.getElementById('progress');
  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;

  // Calculate the frame index based on the progress bar value
  frameIndex = Math.floor((progress.value / 100) * numFrames);

  // Retrieve the frame key corresponding to the frame index
  const frameKey = frameKeys[frameIndex];

  // Update the player position based on the frame key
  updateFrame(frameKey);
}

```
