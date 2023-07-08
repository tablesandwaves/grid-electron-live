/**
 * Generate a self-replicating melody based on this Melody's steps.
 *
 * @param inputMelody an input melody from which to generate a self-replicating sequence
 * @returns a new melody with steps that self-replicate at the ratio of 2:1
 */
const selfReplicate = (inputMelody) => {
  const ratio = 2, length = 63;

  let sequence = new Array(length).fill(-1);
  sequence[0] = inputMelody[0];
  sequence[1] = inputMelody[1];

  let contiguousSequence, currentNote, stepAmount, nextNote;
  let nextEmpty = sequence.findIndex(note => note == -1),
      count = 2;

  // Build a self replicating melody by powers of 2 until all notes are filled.
  do {
      contiguousSequence = sequence.slice(0, nextEmpty);

      for (let noteIndex = 0; noteIndex < contiguousSequence.length; noteIndex++) {
          // For each note in the contiguous sequence...
          currentNote = contiguousSequence[noteIndex];

          // Determine the self replicating step amounts by computing the powers of 2 for
          // non-redundant step amounts based on the target length
          for (let power = 1; power <= Math.log2(length); power++) {
              stepAmount = ratio ** power;

              // Fill in the melody's future step indices with the current replicating note.
              sequence[(noteIndex * stepAmount) % length] = currentNote;
          }
      }

      // If the sequence still has empty spots, find the first one and fill it with the next
      // note in the input note list.
      nextNote = inputMelody[count % inputMelody.length];
      nextEmpty = sequence.findIndex(note => note == -1);
      if (nextEmpty != -1) sequence[nextEmpty] = nextNote;
      count++;
  } while (nextEmpty != -1);

  return sequence;
}


module.exports = {
  selfReplicate: selfReplicate
}
