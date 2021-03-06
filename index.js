"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var events = {
    start: ['animationstart', 'webkitAnimationStart', 'mozAnimationStart', 'oanimationstart', 'MSAnimationStart'],
    end: ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd', 'oanimationend', 'MSAnimationEnd'],
    startRemoved: [],
    endRemoved: []
};
/**
 * # AnimateOnChange component.
 * Adds `animationClassName` when `animate` is true, then removes
 * `animationClassName` when animation is done (event `animationend` is
 * triggered).
 *
 * @prop {string} baseClassName - Base class name.
 * @prop {string} animationClassName - Class added when `animate == true`.
 * @prop {bool} animate - Wheter to animate component.
 */
var AnimateOnChange = /** @class */ (function (_super) {
    __extends(AnimateOnChange, _super);
    function AnimateOnChange(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { animating: false, clearAnimationClass: false };
        _this.animationStart = _this.animationStart.bind(_this);
        _this.animationEnd = _this.animationEnd.bind(_this);
        _this.setElementRef = function (ref) {
            _this.elm = ref;
        };
        return _this;
    }
    AnimateOnChange.prototype.componentDidMount = function () {
        this.addEventListener('start', this.elm, this.animationStart);
        this.addEventListener('end', this.elm, this.animationEnd);
    };
    AnimateOnChange.prototype.componentWillUnmount = function () {
        this.removeEventListeners('start', this.elm, this.animationStart);
        this.removeEventListeners('end', this.elm, this.animationEnd);
    };
    AnimateOnChange.prototype.addEventListener = function (type, elm, eventHandler) {
        // until an event has been triggered bind them all
        events[type].map(function (event) {
            // console.log(`adding ${event}`)
            // @ts-ignore
            elm.addEventListener(event, eventHandler);
        });
    };
    AnimateOnChange.prototype.removeEventListeners = function (type, elm, eventHandler) {
        events[type].map(function (event) {
            // console.log(`removing ${event}`)
            // @ts-ignore
            elm.removeEventListener(event, eventHandler);
        });
    };
    AnimateOnChange.prototype.updateEvents = function (type, newEvent) {
        // console.log(`updating ${type} event to ${newEvent}`)
        events[type + 'Removed'] = events[type].filter(function (e) { return e !== newEvent; });
        events[type] = [newEvent];
    };
    AnimateOnChange.prototype.animationStart = function (e) {
        if (events['start'].length > 1) {
            this.updateEvents('start', e.type);
            this.removeEventListeners('startRemoved', this.elm, this.animationStart);
        }
        this.setState({ animating: true, clearAnimationClass: false });
    };
    AnimateOnChange.prototype.animationEnd = function (e) {
        if (events['end'].length > 1) {
            this.updateEvents('end', e.type);
            this.removeEventListeners('endRemoved', this.elm, this.animationStart);
        }
        // send separate, animation state change will not render
        this.setState({ clearAnimationClass: true }); // renders
        this.setState({ animating: false, clearAnimationClass: false });
        if (typeof this.props.onAnimationEnd === 'function') {
            this.props.onAnimationEnd();
        }
    };
    AnimateOnChange.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (this.state.animating !== nextState.animating) {
            // do not render on animation change
            return false;
        }
        return true;
    };
    AnimateOnChange.prototype.render = function () {
        var clearAnimationClass = this.state.clearAnimationClass;
        var _a = this.props, baseClassName = _a.baseClassName, animate = _a.animate, animationClassName = _a.animationClassName, customTag = _a.customTag, children = _a.children, onAnimationEnd = _a.onAnimationEnd, // unpack, such that otherProps does not contain it
        otherProps = __rest(_a, ["baseClassName", "animate", "animationClassName", "customTag", "children", "onAnimationEnd"]);
        var className = baseClassName;
        if (animate && !clearAnimationClass) {
            className += " " + animationClassName;
        }
        var Tag = customTag || 'span';
        return react_1.default.createElement(Tag, __assign({ ref: this.setElementRef, className: className }, otherProps), children);
    };
    return AnimateOnChange;
}(react_1.Component));
exports.default = AnimateOnChange;
