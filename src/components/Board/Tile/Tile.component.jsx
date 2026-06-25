// src/components/Board/Tile/Tile.jsx
import React from "react";
import PropTypes from "prop-types";
import "../Tile/Tile.css";

/**
 * Tile component for Cboard.
 *
 * This component:
 *  - Renders a single interactive tile as a semantic <button>
 *  - Keeps icon + label in the same clickable element so the hitbox
 *    always matches the visible label (fixes misaligned/unresponsive taps on iOS with large Text Size)
 *  - Uses rem-based min width/height so hit target scales with text size
 *  - Avoids nested pointer event capture from icon children
 *
 * Props expected (adapt to your codebase if names differ):
 *  - tile: object { id, label, image, speakText, ... }
 *  - onActivate: function called when tile is activated (click/tap)
 *  - onLongPress: (optional) long press handler
 *  - className: (optional) extra CSS classes
 *  - children: (optional) custom contents (icon, etc)
 */

export default function Tile({ tile, onActivate, onLongPress, className = "", children }) {
  // Basic handlers
  const handleClick = (e) => {
    // keep behavior same as existing code: call onActivate with tile
    if (typeof onActivate === "function") onActivate(tile, e);
  };

  // Optional long-press detection: simple native fallback (you can enhance if project uses Hammer.js)
  let pressTimer = null;
  const handlePointerDown = (e) => {
    if (!onLongPress) return;
    pressTimer = setTimeout(() => {
      onLongPress(tile, e);
    }, 600); // 600ms long press threshold
  };
  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  // Render icon if present: prefer tile.image or children
  const renderIcon = () => {
    if (children) return children;
    if (tile && tile.image) {
      // image string - either URL or base64; adapt if repo stores svg/pictogram differently
      return <img className="tile-icon" src={tile.image} alt="" aria-hidden="true" />;
    }
    // fallback: simple letter badge
    return <span className="tile-fallback-icon" aria-hidden="true">{(tile && tile.label && tile.label[0]) || "?"}</span>;
  };

  const label = (tile && tile.label) || "";

  return (
    <button
      type="button"
      className={`cboard-tile ${className}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      aria-label={label}
    >
      <span className="tile-content" role="presentation">
        <span className="tile-icon-wrapper">{renderIcon()}</span>
        <span className="tile-label">{label}</span>
      </span>
    </button>
  );
}

Tile.propTypes = {
  tile: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onActivate: PropTypes.func,
  onLongPress: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

Tile.defaultProps = {
  onActivate: () => {},
  onLongPress: null,
  className: "",
  children: null,
};
