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
      const sineArgument =
        (Math.PI / 180) *
        ((360 / maxRadius) * (i * trial.density) + 90 + trial.phaseOffset);
      const sineAtArgument = Math.sin(sineArgument);

      const standardizedSine = (sineAtArgument + 1) / 2;

      const color = standardizedSine * 255;
      console.log(color);

      let radius = i;

      // Set variable attributes
      circle.setAttribute('r', `${radius}`);
      circle.setAttribute('fill', `rgb(${color},${color},${color})`);

      // Append to svg
      svg.appendChild(circle);
    }

    const tmpParent = document.createElement('div');
    tmpParent.appendChild(svg);

    display_element.innerHTML = tmpParent.innerHTML;

    // data saving
    var trial_data = {
      parameter_name: 'parameter value',
    };

    // end trial (instantly, no interaction.)
    this.jsPsych.finishTrial(trial_data);
  }
}

export default CircularSineStimulusPlugin;
