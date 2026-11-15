"use client";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { BoardArtifact } from "./BoardArtifact";

export function BoardDemo() {
  const [converted, setConverted] = useState(false);
  return (
    <div
      className="board-demo product-art product-art-boardeject"
      data-converted={converted}
    >
      <BoardArtifact progress={converted ? 1 : 0} />
      <button
        type="button"
        onClick={() => setConverted(!converted)}
        className="board-demo-action"
      >
        {converted ? <RotateCcw size={17} /> : <ArrowRight size={17} />}
        {converted ? "See the original" : "See the editable version"}
      </button>
      <p role="status">
        {converted
          ? "Three shapes and two connections, ready to edit."
          : "A small idea, ready for a new canvas."}
      </p>
      <small>Sample workflow. Open BoardEject to convert a file.</small>
    </div>
  );
}
