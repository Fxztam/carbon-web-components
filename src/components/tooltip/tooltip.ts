import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement, LitElement } from 'lit-element';
import HostListener from '../../globals/decorators/HostListener';
import HostListenerMixin from '../../globals/mixins/HostListener';
import BXFloatingMenu from '../floating-menu/floating-menu';
import BXFloatingMenuTrigger from '../floating-menu/floating-menu-trigger';
import styles from './tooltip.scss';

const { prefix } = settings;
const find = (a: NodeListOf<Node>, predicate: (search: Node) => boolean) => Array.prototype.find.call(a, predicate);

/**
 * Trigger button of tooltip.
 */
@customElement(`${prefix}-tooltip` as any)
class BXTooltip extends HostListenerMixin(LitElement) implements BXFloatingMenuTrigger {
  /**
   * The menu body.
   */
  private _menuBody: BXFloatingMenu | null = null;

  /**
   * Handles `click` event on this element.
   */
  @HostListener('click')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleClick = () => {
    this.open = !this.open;
  };

  /**
   * `true` if the dropdown should be open. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * @returns The position of the trigger button in the viewport.
   */
  get triggerPosition() {
    const triggerNode = this.shadowRoot!.querySelector((this.constructor as typeof BXTooltip).selectorTrigger);
    if (!triggerNode) {
      throw new TypeError('Cannot find the trigger button.');
    }
    return triggerNode.getBoundingClientRect();
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex')) {
      // TODO: Should we use a property?
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'true');
    }
    if (!this.hasAttribute('aria-expanded')) {
      this.setAttribute('aria-expanded', 'false');
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    super.connectedCallback();
  }

  attributeChangedCallback(name, old, current) {
    if (old !== current) {
      if (name === 'open' && !this._menuBody) {
        this._menuBody = find(this.childNodes, elem => (elem.constructor as typeof BXFloatingMenu).FLOATING_MENU);
      }
      if (this._menuBody) {
        this._menuBody.open = this.open;
      }
      this.setAttribute('aria-expanded', String(Boolean(this.open)));
    }
    super.attributeChangedCallback(name, old, current);
  }

  render() {
    return html`
      <svg id="trigger" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g fill-rule="evenodd">
          <path d="M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" fill-rule="nonzero" />
          <path fill-rule="nonzero" d="M9 13H7V7h2z" />
          <circle cx="8" cy="4" r="1" />
        </g>
      </svg>
      <slot></slot>
    `;
  }

  /**
   * The CSS selector to find the trigger button.
   */
  static selectorTrigger = '#trigger';

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXTooltip;