import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

const info = <const>{
  name: 'circular-sine-grating-plugin',
  parameters: {
    text: {
      type: ParameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEY, KEYS, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
      default: '',
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
class CircularSineGratingPlugin implements JsPsychPlugin<Info> {
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
     * - If noise, add requestAnimationFrame loop to generate noise internally (or if this leads to performance issues, use images and show animation based on them)
     */

    // display text
    let html = `<p>Hello, ${trial.text}</p>`;
    display_element.innerHTML = html;

    // data saving
    var trial_data = {
      parameter_name: 'parameter value',
    };

    // end trial (instantly, no interaction.)
    this.jsPsych.finishTrial(trial_data);
  }
}

export default CircularSineGratingPlugin;
