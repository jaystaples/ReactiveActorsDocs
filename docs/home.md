---
id: home
title: "Reactive Actors"
sidebar_label: "Home"
sidebar_position: 1
description: "What Reactive Actors is, what's in it and when to use it."
slug: /
---

# Reactive Actors

Reactive Actors lets you give any actor in your level its own behaviour, without making a new Blueprint class. You add a **Reaction Component**, then build its logic in the Details panel from small, reusable pieces: *when this happens, do these things*.

It's built for level and game designers. If you can fill in a Details panel, you can use it. Programmers can add new pieces in Blueprint or C++, and everyone else gets them in the same dropdowns.

## A 30-second example

A lamp should spark and play a creak when the player picks up a photo, but only the first time.

1. Add a **Reaction Component** to the lamp.
2. Add a **Reaction** that listens for the event `Event.Photo.PickedUp`.
3. Give it two **Actions**: *Spawn VFX* (from [Reactive Actors Extras](./built-in-reference.md#reactive-actors-extras)) and *Play Sound*.
4. Give it one **Rule**: *Max Activations* set to 1.
5. When the photo is picked up, send `Event.Photo.PickedUp` (with the *Broadcast Event* node or action). The lamp reacts.

The photo doesn't need to know the lamp exists, and the lamp doesn't need to know where the event came from. That's the whole idea: things in your level **send events**, and anything that cares **reacts**.

:::tip

New to the plugin? Start with [Getting Started](./getting-started.md), then read [Core Concepts](./core-concepts.md). Everything else is there for when you need it.

:::

## What's in the plugin

| Piece | What it does | Example |
| --- | --- | --- |
| **Reaction Component** | Lives on an actor and holds its reactions | The lamp's component |
| **Reaction** | "When this event arrives, run these actions" | When `Event.Photo.PickedUp`, flicker |
| **Action** | One thing done to an actor | Play Sound, Delay, Set Actor Hidden |
| **Requirement** | A yes/no check before something happens | Is the instigator the player? |
| **Rule** | A limiter with memory, or extra stuff a reaction should do. | Only once; not more than every 5 seconds |
| **Trigger** | Watches for something and sends an event | On Begin Play, send `Event.Level.Started` |
| **Reaction Preset** | A saved set of reactions to reuse on many actors | Same reaction for every flickering lamp in the house |
| **Reactive Volume** | An invisible box from Place Actors > Reactive that sends events when actors walk in or out | Player enters the attic: send `Event.Attic.Entered` |

## When to use Reactive Actors

| Use Reactive Actors for | Use something else for |
| --- | --- |
| Props reacting to things that happen: lights, doors, sounds, scares | Long scripted story sequences with lots of branching: **Flow** or a dialogue tool |
| The same behaviour on many actors (with a Preset) | Camera and animation timing: **Sequencer** (play it from a reaction with Play Level Sequence) |
| Simple and unique logic you want for each placed actor, without new Blueprint classes. | Complex per-frame gameplay, such as AI or physics puzzles: a Blueprint or C++ class |
| Designer and Programmer QOL. Changing one action affects the way it's run on every actor that uses it. | Events that affect thousands of actors. UObject count can increase quickly if you have tons of Reactions waiting to fire. |

They mix well: a Flow graph, a Sequencer event or a Blueprint can send an event, and every reactive actor listening reacts.

## Where to go next

- [Getting Started](./getting-started.md): install the plugin and build your first reaction, step by step.
- [Core Concepts](./core-concepts.md): how events, reactions, actions and the rest fit together.
- [Guides](./guides.md): recipes for common jobs, such as one-time scares, keys and doors, and randomness.
- [Save and Load](./save-and-load.md): keep what reactions remember in your game's saves, with any save system.
- [Built-in Reference](./built-in-reference.md): every action, requirement, rule and trigger, with its settings.
- [Making Your Own](./making-your-own.md): write new actions, requirements, rules and triggers in Blueprint.
- [Debugging and Settings](./debugging-and-settings.md): see what's happening while you play, and the project settings.
- [FAQ](./faq.md): "why didn't my reaction fire?" and other common questions.

## Requirements

- Unreal Engine 5.7 (tested on 5.7.4). Versions 5.2 and earlier probably won't compile.
- The **Gameplay Tags** and **Data Validation** plugins, which are enabled by default in most projects.
- Reactive Actors Extras (optional) also needs **Niagara** for Spawn VFX.
