import { memo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fileTree } from "../data/codePreviewFileTree";

const defaultOpenPaths = new Set([
  "my-awesome-app/",
  "my-awesome-app/client/",
  "my-awesome-app/client/src/",
  "my-awesome-app/server/",
  "my-awesome-app/server/src/",
]);

const TreeNode = memo(function TreeNode({
  node,
  depth = 0,
  index = 0,
  parentPath = "",
  reduceMotion = false,
}) {
  const fullPath = `${parentPath}${node.name}`;
  const [open, setOpen] = useState(() => defaultOpenPaths.has(fullPath));
  const isFolder = node.type === "folder" || node.type === "root";
  const hasChildren = node.children?.length > 0;

  const indent = depth * 16;
  const animDelay = reduceMotion ? "0ms" : `${index * 30}ms`;

  return (
    <div style={{ animationDelay: animDelay }} className={reduceMotion ? "" : "animate-fadeIn"}>
      <div
        className={`flex items-center gap-1.5 py-[2px] px-2 rounded-md transition-all duration-150 cursor-pointer group
          ${isFolder ? "hover:bg-white/5" : "hover:bg-white/[0.03]"}`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => isFolder && hasChildren && setOpen((o) => !o)}
      >
        {/* connector lines */}
        {depth > 0 && (
          <span className="text-gray-700 select-none font-mono text-xs mr-0.5">
            {isFolder && hasChildren ? (open ? "▾" : "▸") : "·"}
          </span>
        )}

        <span className="text-base leading-none">{node.icon}</span>
        <span
          className={`font-mono text-xs ${node.color} group-hover:brightness-125 transition-all`}
        >
          {node.name}
        </span>

        {isFolder && hasChildren && (
          <span className="ml-auto text-[10px] text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {node.children.length} items
          </span>
        )}
      </div>

      {isFolder && open && hasChildren && (
        <div className="relative">
          {/* vertical guide line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/5"
            style={{ left: `${indent + 18}px` }}
          />
          {node.children.map((child, i) => (
            <TreeNode
              key={`${fullPath}${child.name}`}
              node={child}
              depth={depth + 1}
              index={i}
              parentPath={fullPath}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      )}
    </div>
  );
},
(prev, next) =>
  prev.node === next.node &&
  prev.depth === next.depth &&
  prev.index === next.index &&
  prev.parentPath === next.parentPath &&
  prev.reduceMotion === next.reduceMotion);

export default function CodePreviewSection() {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  const treeHeight = expanded ? 640 : 340;
  const treeTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <section
      id="structure"
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-gray-900 px-6 py-24"
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate3d(-6px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
          opacity: 0;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.35; }
        }
        .pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }

        /* Theme-matched scrollbar (scoped to this component) */
        .ds-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.55) rgba(255, 255, 255, 0.06);
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-gutter: stable;

          /* isolate scrolling paints to reduce jank */
          contain: paint;
          transform: translateZ(0);
        }
        .ds-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .ds-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-left: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ds-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(168, 85, 247, 0.55),
            rgba(59, 130, 246, 0.45)
          );
          border: 2px solid rgba(3, 7, 18, 0.8);
        }
        .ds-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(168, 85, 247, 0.7),
            rgba(59, 130, 246, 0.6)
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn {
            animation: none !important;
            opacity: 1 !important;
            will-change: auto !important;
          }
        }
      `}</style>

      {/* glow backgrounds */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full pulse-glow" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full translate-x-64 -translate-y-32" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            auto-generated scaffold
          </div>
          <h2 className="text-4xl md:text-6xl font-bold pb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-5">
            Clean, Organized Structure
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            DevStarter generates scalable project architecture following real-world best practices.
          </p>
        </div>

        {/* code window */}
        <div className="relative group max-w-3xl mx-auto">
          {/* gradient border glow */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-cyan-500/40 blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative bg-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* terminal header bar */}
            <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-black/30">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full hover:brightness-125 cursor-pointer transition" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full hover:brightness-125 cursor-pointer transition" />
                <span className="w-3 h-3 bg-green-500 rounded-full hover:brightness-125 cursor-pointer transition" />
              </div>

              <span className="absolute left-1/2 -translate-x-1/2 text-gray-500 text-xs font-mono tracking-wider whitespace-nowrap">
                project-structure
              </span>

              <div className="hidden md:flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400/70 bg-emerald-400/10 px-2 py-0.5 rounded">
                  fullstack
                </span>
                <span className="text-[11px] font-mono text-blue-400/70 bg-blue-400/10 px-2 py-0.5 rounded">
                  typescript
                </span>
              </div>
            </div>

            {/* stats bar */}
            <div className="flex items-center gap-6 px-5 py-2.5 border-b border-white/[0.04] bg-black/20 text-[11px] font-mono">
              <span className="text-gray-600">
                <span className="text-gray-400">📁</span> 18 folders
              </span>
              <span className="text-gray-600">
                <span className="text-gray-400">📝</span> 36 files
              </span>
              <span className="text-gray-600">
                <span className="text-gray-400">⚡</span> production-ready
              </span>
            </div>

            {/* file tree */}
            <motion.div
              initial={false}
              animate={{ height: treeHeight }}
              transition={treeTransition}
              style={{ willChange: reduceMotion ? "auto" : "height" }}
              className="overflow-hidden"
            >
              <div className="ds-scrollbar h-full py-4 px-2 overflow-y-auto overscroll-contain">
                {fileTree.map((node, i) => (
                  <TreeNode
                    key={node.name}
                    node={node}
                    depth={0}
                    index={i}
                    parentPath=""
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </motion.div>

            {/* expand / collapse footer */}
            <div className="relative">
              <motion.div
                aria-hidden="true"
                className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"
                initial={false}
                animate={{ opacity: expanded ? 0 : 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
              />
              <div className="border-t border-white/[0.06] bg-black/30 px-5 py-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-600 font-mono">
                  {expanded ? "showing full tree" : "tree truncated"}
                </span>
                <button
                  type="button"
                  data-no-loader="true"
                  onClick={(event) => {
                    event.preventDefault();
                    setExpanded((e) => !e);
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors group/btn"
                >
                  <span>{expanded ? "Collapse tree ↑" : "Expand full tree ↓"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 group-hover/btn:border-purple-500/40 transition">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          </div>

        {/* bottom feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {["Monorepo ready", "Docker included", "TypeScript first", "Auto .env setup"].map((label) => (
            <span
              key={label}
              className="text-xs font-mono text-gray-400 border border-white/10 bg-white/[0.03] px-3 py-1.5 rounded-full hover:border-purple-500/30 hover:text-gray-300 transition-all cursor-default"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}