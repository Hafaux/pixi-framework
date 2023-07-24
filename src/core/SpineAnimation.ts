import { Assets } from "pixi.js";
import {
  type AnimationStateListener,
  type TrackEntry,
  Spine,
} from "@pixi-spine/runtime-4.1";

import Deferred from "../utils/Deferred";

export default class SpineAnimation extends Spine {
  playingLabel: string | null = null;
  animDeferred?: Deferred<void>;

  animStateListener: AnimationStateListener = {
    complete: (trackEntry: TrackEntry) => {
      if (trackEntry.animation?.name === this.playingLabel) {
        this.animDeferred?.resolve();
        this.playingLabel = null;
      }
    },

    interrupt: () => {
      this.animDeferred?.resolve();
      this.playingLabel = null;
    },
  };

  constructor(name: string, skin?: string) {
    const spineData = Assets.cache.get(name)?.spineData;

    if (!spineData) throw new Error(`Spine data for ${name} not found!`);

    super(spineData);

    this.state.addListener(this.animStateListener);

    this.name = name;

    if (skin) this.setSkin(skin);
  }

  play(name: string, loop = false) {
    this.state.setAnimation(0, name, loop);

    this.playingLabel = name;

    this.animDeferred = new Deferred();

    return this.animDeferred.promise;
  }

  hasSkin(name: string) {
    return this.skeleton.data.skins.find((skin) => skin.name === name);
  }

  setSkin(skin: string, resetPose = true) {
    if (!this.hasSkin(skin)) {
      throw new Error(`Skin ${skin} not found in ${this.name}`);
    }

    this.skeleton.setSkinByName(skin);

    if (resetPose) this.skeleton.setSlotsToSetupPose();
  }

  get skin() {
    return this.skeleton.skin?.name;
  }
}
