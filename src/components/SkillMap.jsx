import { useEffect, useRef, useState } from "react";
import { getLevelMeta, getStatusMeta } from "../utils/presentation.js";
import { getSkillLogo } from "../utils/skillLogos.js";

const PLANE_WIDTH = 2400;
const PLANE_HEIGHT = 1600;
const EXTRA_RIGHT_PAN = 200;
const PLANE_LEFT_OVERSCAN = EXTRA_RIGHT_PAN;
const TABLET_BREAKPOINT = 1100;
const MOBILE_BREAKPOINT = 900;

function getInitialOffset() {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    return { x: -250, y: -40 };
  }

  if (window.innerWidth <= TABLET_BREAKPOINT) {
    return { x: -250, y: 0 };
  }

  return { x: 0, y: 0 };
}

function getNodeLabel(nodeId, skills, labels) {
  if (skills[nodeId]) {
    return skills[nodeId].name;
  }

  return labels?.[nodeId] ?? nodeId;
}

function hasVisibleDescendant(nodeId, nodes, visibleSkillIds) {
  const childIds = nodes[nodeId] ?? [];

  for (const childId of childIds) {
    if (visibleSkillIds.has(childId) || hasVisibleDescendant(childId, nodes, visibleSkillIds)) {
      return true;
    }
  }

  return false;
}

function SkillMapBranch({
  expandedNodes,
  labels,
  nodeId,
  nodes,
  onSelect,
  onToggle,
  selectedNodeId,
  skills,
  visibleSkillIds,
}) {
  const skill = skills[nodeId] ?? null;
  const childIds = nodes[nodeId] ?? [];
  const visibleChildren = childIds.filter(
    (childId) => visibleSkillIds.has(childId) || hasVisibleDescendant(childId, nodes, visibleSkillIds),
  );
  const isExpanded = expandedNodes.includes(nodeId);
  const isSelected = selectedNodeId === nodeId;
  const isVisibleNode = skill ? visibleSkillIds.has(nodeId) : visibleChildren.length > 0;
  const levelMeta = skill ? getLevelMeta(skill.level) : null;
  const statusMeta = skill ? getStatusMeta(skill.status) : null;
  const skillLogo = skill ? getSkillLogo(skill.icon) : null;

  if (!isVisibleNode) {
    return null;
  }

  return (
    <div className="map-branch">
      <button
        className={[
          "map-node",
          isSelected ? "is-selected" : "",
          !skill ? "is-group" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-node-id={nodeId}
        type="button"
        onClick={() => {
          if (skill) {
            onSelect(nodeId);
          } else if (childIds.length > 0) {
            onToggle(nodeId);
          }
        }}
      >
        <span className="map-node-header">
          {skillLogo ? (
            <img
              alt={`${skill.name} logo`}
              className="skill-logo skill-logo-small"
              src={skillLogo}
            />
          ) : null}
          <span className="map-node-title">{getNodeLabel(nodeId, skills, labels)}</span>
        </span>
        {skill ? (
          <span className="map-node-meta">
            <span className={`tree-badge ${levelMeta.className}`}>{levelMeta.label}</span>
            <span className={`tree-badge status-pill ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
          </span>
        ) : (
          <span className="map-group-meta">
            {visibleChildren.length} node{visibleChildren.length === 1 ? "" : "s"}
          </span>
        )}
      </button>

      {visibleChildren.length > 0 ? (
        <button
          className="map-expand"
          type="button"
          onClick={() => onToggle(nodeId)}
        >
          {isExpanded ? "Collapse branch" : "Expand branch"}
        </button>
      ) : null}

      {visibleChildren.length > 0 && isExpanded ? (
        <div className="map-children">
          {visibleChildren.map((childId) => (
            <SkillMapBranch
              expandedNodes={expandedNodes}
              key={childId}
              labels={labels}
              nodeId={childId}
              nodes={nodes}
              onSelect={onSelect}
              onToggle={onToggle}
              selectedNodeId={selectedNodeId}
              skills={skills}
              visibleSkillIds={visibleSkillIds}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SkillMap({
  expandedNodes,
  labels,
  nodes,
  obstructionRect = null,
  onSelect,
  onToggle,
  roots,
  selectedNodeId,
  skills,
  visibleSkillIds,
}) {
  const surfaceRef = useRef(null);
  const previousSelectedNodeIdRef = useRef(selectedNodeId);
  const lastObstructionWidthRef = useRef(0);
  const hasAutoShiftedForObstructionRef = useRef(false);
  const dragStateRef = useRef({
    isDragging: false,
    hasMoved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(() => getInitialOffset());

  useEffect(() => {
    function handleWindowPointerMove(event) {
      if (
        !dragStateRef.current.isDragging ||
        dragStateRef.current.pointerId !== event.pointerId
      ) {
        return;
      }

      const deltaX = event.clientX - dragStateRef.current.startX;
      const deltaY = event.clientY - dragStateRef.current.startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragStateRef.current.hasMoved = true;
      }

      setOffset(
        clampOffset(
          dragStateRef.current.startOffsetX + deltaX,
          dragStateRef.current.startOffsetY + deltaY,
        ),
      );
    }

    function handleWindowPointerUp(event) {
      if (dragStateRef.current.pointerId !== event.pointerId) {
        return;
      }

      dragStateRef.current.isDragging = false;
      dragStateRef.current.pointerId = null;
      dragStateRef.current.hasMoved = false;
      setIsDragging(false);
    }

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, []);

  useEffect(() => {
    const surfaceElement = surfaceRef.current;

    if (!surfaceElement) {
      return;
    }

    function handleWheel(event) {
      event.preventDefault();
      const deltaX = event.deltaX + (event.shiftKey ? event.deltaY : 0);
      const deltaY = event.shiftKey ? 0 : event.deltaY;

      setOffset((current) =>
        clampOffset(current.x - deltaX, current.y - deltaY),
      );
    }

    surfaceElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      surfaceElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  function clampOffset(nextX, nextY) {
    if (!surfaceRef.current) {
      return { x: nextX, y: nextY };
    }

    const surfaceWidth = surfaceRef.current.clientWidth;
    const surfaceHeight = surfaceRef.current.clientHeight;
    const renderedPlaneWidth = PLANE_WIDTH + PLANE_LEFT_OVERSCAN;
    const minX = Math.min(0, surfaceWidth - renderedPlaneWidth + PLANE_LEFT_OVERSCAN);
    const minY = Math.min(0, surfaceHeight - PLANE_HEIGHT);
    const maxX = EXTRA_RIGHT_PAN;
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, nextX)),
      y: Math.max(minY, Math.min(maxY, nextY)),
    };
  }

  useEffect(() => {
    if (!selectedNodeId || !surfaceRef.current) {
      return;
    }

    hasAutoShiftedForObstructionRef.current = false;

    const frameId = window.requestAnimationFrame(() => {
      const selectedNode = surfaceRef.current?.querySelector(
        `[data-node-id="${selectedNodeId}"]`,
      );

      if (!selectedNode || !surfaceRef.current) {
        return;
      }

      const surfaceRect = surfaceRef.current.getBoundingClientRect();
      const nodeRect = selectedNode.getBoundingClientRect();
      const viewportPadding = 24;
      const obstructionClearance = 50;
      const leftSafeEdge = surfaceRect.left + viewportPadding;
      const rightSafeEdge = surfaceRect.right - viewportPadding;
      const topSafeEdge = surfaceRect.top + viewportPadding;
      const bottomSafeEdge = surfaceRect.bottom - viewportPadding;
      let deltaX = 0;
      let deltaY = 0;

      if (obstructionRect) {
        const paddedObstruction = {
          bottom: obstructionRect.bottom + viewportPadding,
          left: obstructionRect.left - viewportPadding,
          right: obstructionRect.right + viewportPadding,
          top: obstructionRect.top - viewportPadding,
        };
        const overlapsHorizontally =
          nodeRect.left < paddedObstruction.right && nodeRect.right > paddedObstruction.left;
        const overlapsVertically =
          nodeRect.top < paddedObstruction.bottom && nodeRect.bottom > paddedObstruction.top;

        if (overlapsHorizontally && overlapsVertically) {
          const moveRight = paddedObstruction.right - nodeRect.left + obstructionClearance;
          const moveLeft = paddedObstruction.left - nodeRect.right - obstructionClearance;
          const canMoveRight = nodeRect.right + moveRight <= rightSafeEdge;
          const canMoveLeft = nodeRect.left + moveLeft >= leftSafeEdge;

          if (canMoveRight) {
            deltaX = moveRight;
          } else if (canMoveLeft) {
            deltaX = moveLeft;
          } else {
            const moveBelow = paddedObstruction.bottom - nodeRect.top + obstructionClearance;
            const moveAbove = paddedObstruction.top - nodeRect.bottom - obstructionClearance;
            const canMoveBelow = nodeRect.bottom + moveBelow <= bottomSafeEdge;
            const canMoveAbove = nodeRect.top + moveAbove >= topSafeEdge;

            if (canMoveBelow) {
              deltaY = moveBelow;
            } else if (canMoveAbove) {
              deltaY = moveAbove;
            }
          }
        }
      }

      const adjustedNodeRect = {
        bottom: nodeRect.bottom + deltaY,
        left: nodeRect.left + deltaX,
        right: nodeRect.right + deltaX,
        top: nodeRect.top + deltaY,
      };

      if (adjustedNodeRect.left < leftSafeEdge) {
        deltaX += leftSafeEdge - adjustedNodeRect.left;
      } else if (adjustedNodeRect.right > rightSafeEdge) {
        deltaX += rightSafeEdge - adjustedNodeRect.right;
      }

      if (adjustedNodeRect.top < topSafeEdge) {
        deltaY += topSafeEdge - adjustedNodeRect.top;
      } else if (adjustedNodeRect.bottom > bottomSafeEdge) {
        deltaY += bottomSafeEdge - adjustedNodeRect.bottom;
      }

      if (deltaX !== 0 || deltaY !== 0) {
        if (obstructionRect && deltaX !== 0) {
          hasAutoShiftedForObstructionRef.current = true;
        }
        setOffset((current) => clampOffset(current.x + deltaX, current.y + deltaY));
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [obstructionRect, selectedNodeId]);

  useEffect(() => {
    if (obstructionRect) {
      lastObstructionWidthRef.current = obstructionRect.right - obstructionRect.left;
    }
  }, [obstructionRect]);

  useEffect(() => {
    const previousSelectedNodeId = previousSelectedNodeIdRef.current;

    if (
      previousSelectedNodeId &&
      !selectedNodeId &&
      hasAutoShiftedForObstructionRef.current
    ) {
      const reclaimShift = Math.max(140, Math.round(lastObstructionWidthRef.current * 0.45));
      setOffset((current) => clampOffset(current.x - reclaimShift, current.y));
      hasAutoShiftedForObstructionRef.current = false;
    }

    previousSelectedNodeIdRef.current = selectedNodeId;
  }, [selectedNodeId]);

  function handlePointerDown(event) {
    if (!surfaceRef.current || !event.isPrimary || event.button !== 0) {
      return;
    }

    if (event.target instanceof Element && event.target.closest("button")) {
      return;
    }

    event.preventDefault();
    surfaceRef.current.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      isDragging: true,
      hasMoved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
    setIsDragging(true);
  }

  function handleClickCapture(event) {
    if (dragStateRef.current.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.hasMoved = false;
    }
  }

  return (
    <div
      className={`map-surface ${isDragging ? "is-dragging" : ""}`}
      onClickCapture={handleClickCapture}
      ref={surfaceRef}
      tabIndex={0}
    >
      <div
        className="map-plane"
        onPointerDown={handlePointerDown}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <div className="map-roots">
          {roots.map((rootId) => (
            <div className="map-root-column" key={rootId}>
              <SkillMapBranch
                expandedNodes={expandedNodes}
                labels={labels}
                nodeId={rootId}
                nodes={nodes}
                onSelect={onSelect}
                onToggle={onToggle}
                selectedNodeId={selectedNodeId}
                skills={skills}
                visibleSkillIds={visibleSkillIds}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
