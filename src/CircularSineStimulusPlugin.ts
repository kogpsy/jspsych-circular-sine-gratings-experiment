import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

const info = <const>{
  name: 'circular-sine-stimulus-plugin',
  parameters: {
    size: {
      type: ParameterType.INT,
      default: 200,
    },
    density: {
      type: ParameterType.INT,
      default: 1,
    },
    phaseOffset: {
      type: ParameterType.INT,
      default: 0,
    },
    color: {
      type: ParameterType.STRING,
      default: 'black',
    },
    opacity: {
      type: ParameterType.FLOAT,
      default: 1,
    },
  },
};

type Info = typeof info;

/**
 * **PLUGIN-NAME**
 *
 * SHORT PLUGIN DESCRIPTION
 *
 * @author YOUR NAME
 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
 */
class CircularSineStimulusPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    /**
     * Idea
     *
     * - Draw circular sine grating based on params (density, visibility/opacity, and phase (when in default phase circles are drawn black-white, then in fully shifted phase they would be drawn white-black))
     * - Possibility to set the background (static color vs noise)
     * - If noise, add requestAnimationFrame loop to generate noise internally (or if this leads to performance issues, use images and show animation based on them)?
     */

    const maxRadius = (trial.size - 1) / 2;

    // Create and setup SVG dom element
    const svg = document.createElement('svg');
    svg.setAttribute('height', `${trial.size}`);
    svg.setAttribute('width', `${trial.size}`);
    svg.style.opacity = `${trial.opacity}`;
    // Set the blend mode based on the requested color
    if (trial.color === 'black') {
      svg.style.mixBlendMode = 'multiply';
    } else if (trial.color === 'white') {
      svg.style.mixBlendMode = 'screen';
    }

    // Initialize loop varialbes
    let sineArgument: number,
      sineAtArgument: number,
      standardizedSine: number,
      circleColor: number;

    // Append circles programmatically
    for (let i = maxRadius; i >= 1; i -= 1) {
      // Create and setup circle node
      const circle = document.createElement('circle');
      circle.setAttribute('cx', `${trial.size / 2}`);
      circle.setAttribute('cy', `${trial.size / 2}`);
      circle.setAttribute('stroke-width', '0');

      // Calculate properties
      // - Calculate the sine argument in degrees
      // - Shift by 90 degrees so that the standardized sine will start at 1
      //   which results in a white color.
      sineArgument =
        (Math.PI / 180) *
        ((360 / maxRadius) * (i * trial.density) + 90 + trial.phaseOffset);
      sineAtArgument = Math.sin(sineArgument);

      standardizedSine = (sineAtArgument + 1) / 2;

      // If white circles are requested, invert the color
      circleColor = standardizedSine * 255;
      if (trial.color === 'white') {
        circleColor = 255 - circleColor;
      }

      // Set variable attributes
      circle.setAttribute('r', `${i}`);
      circle.setAttribute(
        'fill',
        `rgb(${circleColor},${circleColor},${circleColor})`
      );

      // Append to svg
      svg.appendChild(circle);
    }

    const container = document.createElement('div');
    container.appendChild(svg);

    display_element.innerHTML = container.innerHTML;

    // data saving
    var trial_data = {
      parameter_name: 'parameter value',
    };

    // end trial (instantly, no interaction.)
    this.jsPsych.finishTrial(trial_data);
  }
}

export default CircularSineStimulusPlugin;
