import {Utils} from '../utils';

/**
 * Holds all data for a "note on" MIDI event
 * @param {object} fields {data: []}
 * @return {NoteOnEvent}
 */
class NoteOnEvent {
	constructor(fields) {
		this.type 		= 'note-on';
		this.channel 	= fields.channel || 1;
		this.pitch 		= fields.pitch;
		this.wait 		= fields.wait || 0;
		this.velocity 	= fields.velocity || 50;
		this.startTick 	= fields.startTick || null;

		this.midiNumber = Utils.getPitch(this.pitch);
		this.tick 		= null;
		this.delta 		= null;
		this.data 		= fields.data;
	}

	/**
	 * Builds int array for this event.
	 * @param {Track} track - parent track
	 * @return {NoteOnEvent}
	 */
	buildData(track) {
		this.data = [];

		// Explicitly defined startTick event
		if (this.startTick) {
			this.tick = this.startTick;

			// If this is the first event in the track then use event's starting tick as delta.
			if (track.tickPointer == 0) {
				this.delta = this.tick;
			}

		} else {
			this.delta = Utils.getTickDuration(this.wait);
			this.tick = track.tickPointer + this.delta;
		}

		this.data = Utils.numberToVariableLength(this.delta)
					.concat(
							this.getStatusByte(),
							this.midiNumber,
							Utils.convertVelocity(this.velocity)
					);

		return this;
	}

	/**
	 * Gets the note on status code based on the selected channel. 0x9{0-F}
	 * Note on at channel 0 is 0x90 (144)
	 * 0 = Ch 1
	 * @return {number}
	 */
	getStatusByte() {return 144 + this.channel - 1}
}

export {NoteOnEvent};
