---
id: built-in-reference
title: "Built-in Reference"
sidebar_label: "Built-in Reference"
sidebar_position: 6
description: "Every built-in action, requirement, rule, trigger, placeable actor and Blueprint node."
---

# Built-in Reference

Every piece that ships with the plugin, and its settings. Hover any setting in the Details panel for the same explanation as a tooltip.

## Reaction settings

| Setting | What it does |
| --- | --- |
| **Enabled** | Off: the reaction never fires. |
| **Event Tag** | The event it listens for. Child tags count: `Event.Photo` also hears `Event.Photo.Kitchen`. |
| **Retrigger** | The event arrives again while it's still running. **Ignore**: keep going, ignore the new one. **Restart**: cancel and start again from the first action (it counts as a new activation). |
| **Actions** | Run in order, top to bottom. |
| **Rules** | Limits such as Max Activations and Cooldown. Any rule can block a run. |

## Actions

Every action also has **Enabled** (off: skipped), **Requirements** (checks built into that kind of action) and **Extra Requirements** (checks you add to this one action). If a requirement fails, the action is skipped and the reaction carries on, unless Stop Reaction If Not Met is ticked: then the whole reaction stops there and ends as Failed.

### Flow

| Action | What it does | Settings |
| --- | --- | --- |
| **Branch** | Checks its conditions, then runs one of two action lists in its place. | **Conditions**, **Evaluate Mode** (*All Conditions* / *Any Condition*), **True Actions**, **False Actions** |
| **Random Action** | Picks one option at random and runs its actions in its place. | **Options** (each with a **Weight** and **Actions**), **Avoid Repeat** |
| **Run On Targets** | Runs its actions on every actor with an identity, all at once. A failure on one target doesn't stop the others. | **Target Identity**, **Exclude Self**, **Actions** |
| **Delay** | Waits, then carries on. | **Duration** (seconds) |
| **Wait For Event** | Waits until an event is sent, then carries on. For short, local moments ("close the door, wait for *door closed*, then slam"), not quest steps: a waiting reaction isn't saved. | **Event**, **Exact Match**, **Listen Scope** (*World* / *Identity*), **Listen Identity**, **Timeout** (0 = wait as long as it takes), **Fail On Timeout** |
| **Stop Reaction** | Ends the reaction here. Often used at the end of a branch if you don't want the rest of the actions after the branch to fire. | **Result** (*Succeeded* / *Failed*) |

### Events and reactions

| Action | What it does | Settings |
| --- | --- | --- |
| **Broadcast Event** | Sends an event, to chain reactions together. | **Event**, **Event Scope** (*World* / *Self* / *Identity*), **Target Identity** |
| **Set Reaction Enabled** | Switches reactions on the target on or off while playing. | **Event** (empty = all), **Enable** |

### Actor

| Action | What it does | Settings |
| --- | --- | --- |
| **Set Actor Hidden** | Hides, shows or toggles the target. | **Change** (Hide, Show or Toggle), **Update Collision** (also turn collision off while hidden) |
| **Launch Actor** | Sends the target flying: a physics prop flies off, a character is knocked back. Away from or towards whoever caused it, tilted up so it arcs. Same speed whatever the prop weighs. | **Direction** (Away From / Towards Instigator, Relative to Target, World), **Lift**, **Speed** (cm/s), **Spread**, **Spin**, **Start Physics If Needed**, **Stop Physics When Settled** (puts back Static and collision), **Wait Until Settled**, **Max Settle Time** |

### Presentation

| Action | What it does | Settings |
| --- | --- | --- |
| **Play Sound** | Plays a sound. | **Sound**, **Mode** (*2D* / *At Target* / *Attached to Target*), **Socket**, **Volume**, **Pitch**, **Attenuation**, **Wait Until Finished** |
| **Play Level Sequence** | Plays a Level Sequence. Waits for it to end by default. | **Sequence**, **Play Rate**, **Wait For Sequence To Finish** |

### Debugging

| Action | What it does | Settings |
| --- | --- | --- |
| **Log Message** | Prints a message to the screen and/or the log. Removed from shipping builds. | **Message**, **Print To Screen**, **Print To Log**, **Color**, **Duration** |

## Requirements

Every requirement has **Not**: tick it to pass when the check fails instead. The ones that test an actor also have **Check**: the **Target** (the actor being acted on) or the **Instigator** (who caused it).

| Requirement | Passes when | Settings |
| --- | --- | --- |
| **Has Actor Tags** | The actor has the listed actor tags. | **Check**, **Tags**, **Require All** (off: any one is enough) |
| **Has Components** | The actor has components of the listed classes. | **Check**, **Components**, **Require All** |
| **Implements Interfaces** | The actor implements the listed interfaces. | **Check**, **Interfaces**, **Require All** |
| **Is Class** | The actor is one of the listed classes, or a child of one. | **Check**, **Classes** |
| **Has Identity** | The actor's Reaction Component has the identity, or a child of it. | **Check**, **Identity** |
| **Random Chance** | A dice roll comes up, rolled fresh every check. | **Chance** (0–100%) |
| **In Volume** | The actor is inside a Reactive Volume with that identity, or a child of it (a volume tagged Actor.Room.Kitchen counts for Actor.Room). Checks the Instigator by default. | **Check**, **Volume** |

## Rules

| Rule | What it does | Settings |
| --- | --- | --- |
| **Max Activations** | Blocks once it has run this many times, per actor. | **Max Activations** (0 = unlimited) |
| **Cooldown** | Blocks for a time after each run finishes. | **Cooldown Seconds** |

## Triggers

Every trigger also has **Enabled**, **Event** (what to send; optional), **Event Scope**, **Target Identity** (for Identity scope), **Rules** (checked first) and **Conditions** (checked second).

| Trigger | Fires when | Settings |
| --- | --- | --- |
| **Begin Play** | The actor begins play, every time it does (including when a streamed level or data layer comes back). Fires on the next tick, so actors starting together are listening and a save restored as the level loads is already in place. Add Max Activations = 1 for once only. | none |
| **End Play** | Hidden from the Triggers dropdown; existing ones still work. The actor is destroyed, and optionally when it's unloaded. Never when the game shuts down. | **Also When Unloaded** |
| **Timer** | A delay passes, once or repeatedly. Pauses with the game. | **First Delay**, **Repeat**, **Interval**, **Random Deviation** |
| **Event Received** | Another event is sent. Passes its instigator on. | **Listen For**, **Listen Scope** (*World* / *Self*) |

## Placeable actors

Find these under **Place Actors > Reactive**. They're logic only: invisible in game.

| Actor | What it does | Settings |
| --- | --- | --- |
| **Reactive Volume** | A box that sends events as actors come and go, and keeps track of who's inside for the **In Volume** requirement. Shows as an orange box with a trigger icon in the editor. | **Size** (half-size in cm; the scale tool works too), **Volume Identity Tags** (what In Volume asks for, e.g. Actor.Room.Kitchen), **Target Actor Identity** (only actors with this identity count at all, e.g. Actor.Player), **Enter Event**, **Leave Event**, **Event Scope** (World or Identity), **Conditions** (further checks on who the events are about) |

:::tip

Target Actor Identity reads the identity from the actor's Reaction Component, so give your player pawn a Reaction Component with `Actor.Player` in its Identity Tags, even if it has no reactions. Only actors whose collision generates overlap events are seen; pawns do by default.

:::

## Blueprint nodes

### Sending and controlling events

| Node | What it does |
| --- | --- |
| **Broadcast Event** | Sends an event to everyone listening. |
| **Broadcast Event To Actor** | Sends an event to one actor only. |
| **Broadcast Event To Identity** | Sends an event to every actor with an identity. |
| **Suspend Events** / **Resume Events** / **Are Events Suspended** | Ignore all events for a while (cutscenes, menus). |
| **Cancel All Reactions** (and *For Actor*, *For Identity*, *For Event*) | Stop running reactions. |
| **Reset All Reactions** (and *For Actor*, *For Identity*, *For Event*) | Reset reactions as if they'd never fired. Helpful for resetting things like Max Activations. |
| **Get World Reaction State** / **Set World Reaction State** / **Clear World Reaction State** | Save and load: the current level's reaction state as one value, handed back after loading, or forgotten (New Game). See [Save and Load](./save-and-load.md). |
| **Hold Reactions Until Restored** / **Release Held Reactions** | When loading a save after the level has started: triggers and Reactive Volumes wait until Set World Reaction State. |

### Listening

| Node | What it does |
| --- | --- |
| **Wait For World Event** | Fires **On Event** every time the event is sent anywhere. Allows implementing logic in Blueprints by listening to Broadcasted Events, without using pre-built Reactive Actions. |
| **Wait For Identity Event** | Fires **On Event** when the event is sent to a specific identity only (or a parent of it). |

### Running actions without a component

| Node | What it does |
| --- | --- |
| **Run Reaction Preset** | Runs a Reaction Preset's reactions once on a target, with no Reaction Component. Give it a **Context** (Target, Instigator, Event; use Make Reaction Context or split the pin). Event picks which reactions run; leave it empty for all of them. **Then** fires straight away, **On Finished** (with a Result) when they've all ended, **On Blocked** if nothing started. Rules such as Max Activations remember their state per target between runs. Event graphs only, like any async node. |
| Run Actions, Run Reaction | Older nodes, now deprecated and hidden from the menu. Ones already placed keep working with a warning; swap them for Run Reaction Preset. |
| Run Action | Hidden from the menu for now while its pins get more reliable. Ones already placed keep working. |

### On a Reaction Component

| Node or event | What it does |
| --- | --- |
| **React To** | Makes this component react to an event directly. Listeners elsewhere don't hear it; use Broadcast Event To Actor for that. |
| **Cancel Reactions** / **Reset Reactions** | Stop or reset this component's reactions (optionally for one event). |
| **Set Reactions Enabled** | Switch reactions on or off while playing. |
| **Get Event Tags** / **Get Identity Tags** | What it listens for, and its identities. |
| **On Reaction Started** / **On Reaction Finished** | Events you can bind to, e.g. for UI or sounds. |
| **Capture Reaction State** / **Restore Reaction State** | This component's reaction state on its own, for actors you spawn while playing (placed actors are saved with Get World Reaction State). |

## Reactive Actors Extras

A separate plugin, **Reactive Actors Extras**, adds built-in actions that need more than the engine core. They're common and faster as C++ than Blueprint, but kept apart so Reactive Actors itself needs nothing beyond the engine. Enable it next to Reactive Actors and they appear in every Actions dropdown.

| Action | What it does | Settings | Needs |
| --- | --- | --- | --- |
| **Spawn VFX** | Spawns a Niagara effect at the target, or attached to it. Best for one-shot VFX. | **System**, **Attach**, **Socket**, **Transform** | The Niagara plugin |
| **Set Data Layer State** | Loads, unloads or activates a World Partition data layer. | **Data Layer**, **State**, **Recursive** | A World Partition level |
