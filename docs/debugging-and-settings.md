---
id: debugging-and-settings
title: "Debugging and Settings"
sidebar_label: "Debugging and Settings"
sidebar_position: 8
description: "The debug overlay, console commands, validation, logging and Project Settings."
---

# Debugging and Settings

When a reaction doesn't do what you expect, these tools show you what actually happened. Most are typed into the console: press the backtick key (left of 1) while playing, type the command and press Enter.

:::tip

Start with `Reactions.Show 1` and `Reactions.History`. Between them they answer most "why didn't it fire?" questions.

:::

## In the editor, before you play

- **Actor icon**: every actor with a Reaction Component shows a small icon above it in the editor viewport, so you can spot reactive actors at a glance.
- **Row titles**: every action, requirement, rule and trigger shows a one-line summary, such as *Delay 2.0s* or *Broadcast Event.Door.Open -> World*.
- **Map Check** (**Build → Map Check**): lists problems on every Reaction Component, such as empty action slots, requirements that can never pass on that actor, or an Event Received trigger that would hear its own event.
- **Compile warning**: a custom action Blueprint that never calls **Finish Action** gives a warning when you compile it.

## The overlay: `Reactions.Show 1`

Shows, above each reactive actor:

- its identity tags and the events it listens for;
- each reaction's state: idle, running (and which action it's on), and recent lines such as *fired*, *blocked by Cooldown*, *skipped: requirement failed*, or *failed at Play Sound*;
- each rule's live state, such as *Max Activations 1/1*;
- a warning on any action that has been running a long time without calling Finish Action.

| Command | What it does |
| --- | --- |
| `Reactions.Show 1` / `0` | Turn the overlay on or off. |
| `Reactions.Show.Filter Event.Door` | Only show actors listening for, or identified by, that tag. `None` clears it. |
| `Reactions.Show.Distance 3000` | Only show actors this close to the camera, in cm. |
| `Reactions.Show.Linger 3` | How long *fired*, *blocked* and *skipped* lines stay, in seconds. |
| `Reactions.Show.StuckTime 15` | Flag an action that hasn't finished after this many seconds. `0` = never. |
| `Reactions.Show.Rules 1` | Show each rule's live state. |
| `Reactions.Show.Offset 10` | Height of the text above the actor, in cm. |

## Wiring lines: `Reactions.Show.WiringLines 1`

Draws an arrow from whoever sent each event to every actor it reached: **green** if a reaction fired, **red** if the actor heard it but didn't react (a rule blocked it, or it was already running). Run On Targets draws its lines too. `Reactions.Show.WiringTime` sets how long they stay.

## History: `Reactions.History`

Prints the last 20 events to the log: who sent each one, who it reached, who reacted, and how each reaction ended (succeeded, cancelled, or failed at which action). Add a number for more, such as `Reactions.History 50`.

`Reactions.Show.History 10` shows the last 10 lines on screen while you play, without the overlay. `Reactions.History.Size` sets how many lines are kept.

## Other commands

| Command | What it does |
| --- | --- |
| `Reactions.Broadcast Event.Door.Open` | Sends an event, as if Broadcast Event was called. Great for testing a reaction without its trigger. |
| `Reactions.DumpListeners [Tag]` | Lists every event being listened for, and which actors listen. |
| `Reactions.DumpActors` | Lists every actor with a Reaction Component and its reactions. |
| `Reactions.FindIdentity Actor.Kitchen` | Lists the actors with that identity. |
| `Reactions.Suspend 1` / `0` | Suspend or resume all events. |
| `Reactions.CancelAll` | Cancels every running reaction. |
| `Reactions.ResetAll` | Resets every reaction as if it had never fired. |
| `Reactions.DumpRuns` | Lists one-off runs started from Blueprint (such as Run Reaction Preset) that are still going. |

:::note

The debug commands, overlay and history aren't included in shipping builds.

:::

## Data Validation and Map Check

Problems are caught before you press Play:

- **Data Validation** runs when you save, when you right-click assets and choose **Validate**, and before submitting. It checks Reaction Components (in levels and Blueprints), Reaction Presets and Reactive Volumes: empty slots, reactions with no event or no actions, triggers that do nothing, and each block's own settings (Play Sound with no Sound, Broadcast Event with no Event, Branch with no conditions...). Errors fail validation; warnings don't.
- **Map Check** (Build > Map Check) reports the same problems, plus requirements an actor already fails (an action needing a Light component on an actor without one).
- Action Blueprints that never call **Finish Action** are flagged when compiled and when validated.
- Your own action, requirement, rule and trigger Blueprints are checked for **SaveGame** variables that won't survive a load: actor or component references (save an Identity Tag instead) and Timer Handles (let the timer restart, or use Cooldown). SaveGame on a requirement is flagged too, since requirements are never saved.

Your own blocks can add checks with **Validate Settings** (see [Making Your Own](./making-your-own.md#catch-setup-mistakes-validate-settings)).

## Log and performance

- Everything the plugin logs uses **LogReactiveActors**. Type `Log LogReactiveActors Verbose` in the console for more detail (skipped actions, why things didn't fire), or `Log LogReactiveActors Warning` for less.
- `stat Reactions` shows how long sending events, reacting, running actions, checking requirements and firing triggers take each frame, and how many events, reactions and actions ran. The same names appear in Unreal Insights captures.
- All the debug tools on this page are left out of shipping builds.

## Automated tests

The plugin comes with automated tests that check its core behaviour: events reaching the right actors, chains waiting for Finish Action, failures and cancels, Retrigger, Max Activations, Cooldown, Delay, Branch, Random Action, Run On Targets, Wait For Event, Presets and validation. Open **Tools > Session Frontend**, go to its **Automation** tab, type `ReactiveActors` in the search box, tick the group and press **Start Tests**. They take a few seconds and never touch your levels. Run them after updating the plugin to confirm everything still behaves.

## Project Settings

**Project Settings → Plugins → Reactive Actors**:

| Setting | What it does |
| --- | --- |
| **Event Tag Root** | Event pickers only show this tag and its children, e.g. `Event`. Empty = all tags. |
| **Identity Tag Root** | Identity pickers only show this tag and its children, e.g. `Actor`. Empty = all tags. |
| **Warn On Skipped Actions** | Log a warning when an action is skipped because a requirement failed. Off: logged quietly instead. |
| **Log Failed Reactions** | Log a line when a reaction ends as Failed, naming the action that failed it. |
| **Keep State When Streamed Out** | Actors in levels that stream out and back in keep what their reactions remember (counts, cooldowns, reactions switched off). On by default. Off: they start fresh each time they stream in. |
| **Hold Safety Release** | If Hold Reactions Until Restored gets no Set World Reaction State within this many seconds (default 10), held triggers go ahead anyway, with a warning. 0 = wait forever. |
| **Debug Overlay** settings | The starting values for the `Reactions.Show...` commands above. Typing a command still overrides them for that session. |

:::note

The tag filters apply to pickers in the Details panel. Tag pins on Blueprint nodes still show every tag.

:::
