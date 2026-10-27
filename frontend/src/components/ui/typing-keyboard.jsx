import React, { useEffect, useRef } from "react";
import "./TypingKeyboard.css";

const KEY_INDEX_BY_CODE = {
  81: 15, 87: 16, 69: 17, 82: 18, 84: 19, 89: 20, 85: 21, 73: 22, 79: 23, 80: 24,
  65: 29, 83: 30, 68: 31, 70: 32, 71: 33, 72: 34, 74: 35, 75: 36, 76: 37,
  90: 41, 88: 42, 67: 43, 86: 44, 66: 45, 78: 46, 77: 47,
  32: 56, 13: 39, 8: 27,
};

function Key({ size = "", accent = "" }) {
  const sizeClass = size ? " tk-key--" + size : "";
  const frontAccent = accent === "b" ? " tk-face--b3" : accent === "o" ? " tk-face--o3" : "";
  const sideAccent = accent === "b" ? " tk-face--b1" : accent === "o" ? " tk-face--o1" : "";
  const shadedAccent = accent === "b" ? " tk-face--b2" : accent === "o" ? " tk-face--o2" : "";

  return (
    <div className={"tk-key tk-flex" + sizeClass}>
      <div className={"tk-key__front tk-face" + sizeClass.replace("tk-key--", "tk-key__front--") + frontAccent} />
      <div className={"tk-key__back tk-face" + sizeClass.replace("tk-key--", "tk-key__back--") + sideAccent} />
      <div className={"tk-key__right tk-face" + sizeClass.replace("tk-key--", "tk-key__right--") + sideAccent} />
      <div className={"tk-key__left tk-face" + sizeClass.replace("tk-key--", "tk-key__left--") + shadedAccent} />
      <div className={"tk-key__top tk-face" + sizeClass.replace("tk-key--", "tk-key__top--") + sideAccent} />
      <div className={"tk-key__bottom tk-face" + sizeClass.replace("tk-key--", "tk-key__bottom--") + shadedAccent} />
    </div>
  );
}

export function TypingKeyboard({
  className = "",
  autoTypeText = "PAVITHRAN26 FDE SOFTWARE ENGINEERING APPLIED AI AND RAG      ",
  typingSpeed = [48, 105],
  scale = 0.68,
  accentColor = "#16834b",
  secondaryAccent = "#70dfa1",
  ...props
}) {
  const keyboardRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    const keyboard = keyboardRef.current;
    const screen = screenRef.current;
    if (!keyboard || !screen || !autoTypeText) return undefined;

    keyboard.style.transform = "perspective(10000px) rotateX(60deg) rotateZ(-35deg)";
    const keys = keyboard.querySelectorAll(".tk-key");
    let alive = true;
    let index = 0;
    let timer;
    const releaseTimers = [];

    const pressKey = (keyCode) => {
      const domIndex = KEY_INDEX_BY_CODE[keyCode];
      const key = keys[domIndex];
      if (!key) return;
      key.classList.add("tk-key--down");
      releaseTimers.push(window.setTimeout(() => key.classList.remove("tk-key--down"), 85));
    };

    const typeNext = () => {
      if (!alive) return;
      const character = autoTypeText[index];
      const keyCode = character === " " ? 32 : character.toUpperCase().charCodeAt(0);
      pressKey(keyCode);
      screen.textContent = (screen.textContent || "") + character;
      index += 1;

      if (index >= autoTypeText.length) {
        timer = window.setTimeout(() => {
          if (!alive) return;
          screen.textContent = "";
          index = 0;
          timer = window.setTimeout(typeNext, 850);
        }, 1800);
      } else {
        const minimum = typingSpeed[0];
        const maximum = typingSpeed[1];
        timer = window.setTimeout(typeNext, minimum + Math.random() * (maximum - minimum));
      }
    };

    screen.textContent = "";
    timer = window.setTimeout(typeNext, 1100);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      releaseTimers.forEach((releaseTimer) => window.clearTimeout(releaseTimer));
    };
  }, [autoTypeText, typingSpeed[0], typingSpeed[1]]);

  return (
    <div
      className={"tk-container " + className}
      style={{
        "--tk-accent": accentColor,
        "--tk-secondary": secondaryAccent,
        "--tk-scale": scale,
      }}
      {...props}
    >
      <div className="tk-main tk-flex">
        <div className="tk-keyboard tk-flex" ref={keyboardRef}>
          <div className="tk-screen tk-flex" ref={screenRef} />
          <div className="tk-keyboard__front tk-face" />
          <div className="tk-keyboard__back tk-face" />
          <div className="tk-keyboard__right tk-face" />
          <div className="tk-keyboard__left tk-face" />
          <div className="tk-keyboard__top tk-face">
            <div className="tk-keys">
              <Key accent="b" />
              {Array.from({ length: 12 }).map((_, i) => <Key key={"r1-" + i} />)}
              <Key size="w2" accent="b" />
            </div>
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 12 }).map((_, i) => <Key key={"r2-" + i} />)}
              <Key accent="b" />
            </div>
            <div className="tk-keys">
              <Key size="w3" accent="b" />
              {Array.from({ length: 10 }).map((_, i) => <Key key={"r3-" + i} />)}
              <Key size="w2" accent="o" />
            </div>
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 11 }).map((_, i) => <Key key={"r4-" + i} />)}
              <Key size="w3" accent="b" />
            </div>
            <div className="tk-keys">
              <Key accent="b" />
              <Key accent="o" />
              {Array.from({ length: 2 }).map((_, i) => <Key key={"r5a-" + i} accent="b" />)}
              <Key size="w6" />
              {Array.from({ length: 5 }).map((_, i) => <Key key={"r5b-" + i} accent="b" />)}
            </div>
          </div>
          <div className="tk-keyboard__bottom tk-face" />
        </div>
      </div>
    </div>
  );
}

export default TypingKeyboard;
