import attachMediaStream from 'attachmediastream';

const DEFAULT_GENERATE_OPTIONS = {
  fps: 5,
  quality: 0.75,
  duration: 2,
  width: 240,
  height: 180
};

class FilmstripGenerator {
  constructor( options ){
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.video.setAttribute('autoplay', true);
    this.video.setAttribute('loop', true);
  };
  generateFilmstrip( stream, options, callback ){
    options = {
      ...DEFAULT_GENERATE_OPTIONS,
      ...options
    };
    const frame_count = options.fps * options.duration;
    const delay_ms = (options.duration / (options.fps * options.duration - 1)) * 1000;
    var frames_added = 0;
    attachMediaStream( stream, this.video );
    this.video.style.width = options.width + 'px';
    this.video.style.height = options.height + 'px';
    this.canvas.width = options.width;
    this.canvas.height = options.height * frame_count;
    const captureFrame = () => {
      const offset_y = frames_added * options.height;
      this.context.drawImage( this.video, 0, offset_y, options.width, options.height );
      frames_added++;
      if( frames_added >= frame_count ){
        callback( this.canvas.toDataURL( 'image/jpeg', options.quality ) );
      } else {
        setTimeout( captureFrame, delay_ms );
      }
    };
    // wait until the video feed has started before recording
    var onPlaying = () => {
      captureFrame();
      this.video.removeEventListener( 'playing', onPlaying );
    };
    this.video.addEventListener( 'playing', onPlaying );
  };
};

export default FilmstripGenerator;
