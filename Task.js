let data;
let frameIndex = 0;
let isPlaying = false;
let animationInterval;
const dataUrl = 'https://mostafa-nafie.github.io/front-end-task/data.json';

let pausedFrameIndex = null;
let previousFrameIndex = null;


//Play and pause function
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

// Define updateFrame function
function updateFrame(key) {
  const frame = data[key];
  console.log(`Updating frame ${key}`);
  console.log('Frame data:', frame);

  const visibleArea = d3.select('#visible-area');
  visibleArea.selectAll('*').remove();

  if (frame && frame.visibleAreaPolygon) {
    if (Array.isArray(frame.visibleAreaPolygon) && frame.visibleAreaPolygon.length > 2) {
      const isValidPolygon = frame.visibleAreaPolygon.every(
        point => Array.isArray(point) && point.length === 2
      );

      if (isValidPolygon) {
        visibleArea
          .append('polygon')
          .attr('points', frame.visibleAreaPolygon.map(point => point.join(',')))
          .attr('fill', 'lightgreen');
      } else {
        console.warn(
          `Invalid visibleAreaPolygon data for frame ${key}. Using default polygon.`
        );

        const defaultPolygon = [
          [0, 0],
          [1000, 0],
          [1000, 1000],
          [0, 1000],
        ];

        visibleArea
          .append('polygon')
          .attr('points', defaultPolygon.map(point => point.join(',')))
          .attr('fill', 'lightgreen');
      }
    } else {
      console.warn(
        `Invalid visibleAreaPolygon data for frame ${key}. Using default polygon.`
      );

      const defaultPolygon = [
        [0, 0],
        [1000, 0],
        [1000, 1000],
        [0, 1000],
      ];

      visibleArea
        .append('polygon')
        .attr('points', defaultPolygon.map(point => point.join(',')))
        .attr('fill', 'lightgreen');
    }
  } else {
    console.warn(
      `Invalid frame or visibleAreaPolygon data for frame ${key}. Using default polygon.`
    );

  }

  const svg = d3.select('#field').select('svg');
  svg.selectAll('.player').remove();

  if (frame && frame.detections && Array.isArray(frame.detections) && frame.detections.length > 0) {
   


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
}


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
// Fetch Data
d3.json(dataUrl).then(responseData => {
  data = responseData;
  const frameKeys = Object.keys(data);
  const numFrames = frameKeys.length;
  console.log('Data fetched:', data);

  // Assuming your football field dimensions are 6000 units x 500 units, adjust as needed
  const svg = d3.select('#field').append('svg')
    .attr('width', 6000)
    .attr('height', 500)
    .attr('left', 200)
    ;

  const visibleArea = svg.append('g');
  const tooltip = d3.select('#tooltip');

  // Assuming the first frame key is 'frame_0', adjust if it starts differently
  const initialFrameKey = `frame_${frameIndex}`;
  updateFrame(initialFrameKey);

  
  window.addEventListener('beforeunload', () => {
    clearInterval(animationInterval);
  });
});
