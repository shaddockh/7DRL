declare module "rot" {

    module ROT {

        module Path {
            class AStar {
                constructor(x: number, y: number, callback: (checkX: number, checkY: number) => void, options: any);

                compute(x: number, y: number, callback: (x: number, y: number) => void);
            }
        }

        interface Actionable {
            act();
        }

        interface Scheduler {
            add(item: Actionable, repeat: boolean);
            remove(item: Actionable);
            clear();
        }

        module Scheduler {

            class Simple implements Scheduler {
                add(item: Actionable, repeat: boolean);
                remove(item: Actionable);
                clear();
            }
        }

        module FOV {
            class RecursiveShadowcasting {
                constructor(callback: (x: number, y: number) => boolean);
            }
        }

        module RNG {
            export function clone();
            export function getNormal(mean, stddev): number;
            export function getPercentage(): number;
            export function getSeed(): number;
            export function getState();
            export function getUniform(): number;
            export function getUniformInt(lowerBound, upperBound): number;
            export function getWeightedValue(data);
            export function setSeed(seed: number);
            export function setState(state);
        }

        module Map {
            interface Map {
                create(callback: (x: number, y: number, value: number) => void);
            }

            class Cellular implements Map {
                constructor(width: number, height: number, options: any);
                randomize(randomizationSeed: number);
                create(callback: (x: number, y: number, value: number) => void);
            }

            class Digger implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
                getRooms(): Array<Array<number>>;
            }

            class DividedMaze implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
            }

            class EllerMaze implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
            }

            class IceyMaze implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
            }

            class Rogue implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
            }

            class Uniform implements Map {
                constructor(width: number, height: number, options: any);
                create(callback: (x: number, y: number, value: number) => void);
                getRooms(): Array<Array<number>>;
            }

        }

        class Engine {
            constructor(scheduler: Scheduler);

            /**
             * Start the main loop.
             */
            start();

            /**
             * Interrupt the engine by an asynchronous action
             */
            lock();

            /**
             * Resume execution (paused by a previous lock)
             */
            unlock();
        }
    }

    export = ROT;
}
