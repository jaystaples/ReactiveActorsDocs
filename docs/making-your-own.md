---
id: making-your-own
title: "Making Your Own"
sidebar_label: "Making Your Own"
sidebar_position: 7
description: "Write your own actions, requirements, rules and triggers in Blueprint or C++."
---

# Making Your Own

The built-in pieces cover the basics. Your game's own behaviour (flicker this light, open that drawer, check the player's sanity) goes in pieces you make yourself. You can make all four kinds in Blueprint, and they appear in the same dropdowns as the built-in ones.

To make one, right-click in the Content Browser and choose **Reactive**, then the kind you want. Each one starts with the right parent class and the events you'll need.

| Kind | Name it | You fill in |
| --- | --- | --- |
| Reactive Action | `ACT_FlickerLight` | **Execute Action**, then call **Finish Action** |
| Reactive Requirement | `REQ_IsPlayerLooking` | **Check Requirement** |
| Reactive Rule | `RULE_OncePerNight` | **Should Block**, **On Start**, **On Finish** |
| Reactive Trigger | `TRG_OnPhotoTaken` | **On Activate**, **On Deactivate**, then call **Fire Trigger** |

:::tip

You should give your custom Reactive Blueprint a Display Name, you can do this in the Class Settings. That way when you're selecting a new action, you can see something like Flicker Light, not ACT_FlickerLight.

:::

## Settings designers can change

Any variable you mark **Instance Editable** (the eye icon) shows up in the Details panel when someone adds your piece to a reaction. That's how one `ACT_FlickerLight` can flicker fast on one lamp and slow on another.

:::tip

Give each variable a tooltip (its **Description**).

:::

## Actions

An action does one thing to its **target**.

1. Your logic goes after **Execute Action**. Its **Context** pin has the target, the instigator and the event.
2. When the action is done, call **Finish Action**. Leave **Success** ticked normally; untick it to fail the reaction.

That's it for an instant action. For an action that takes time (a fade, a flicker over two seconds), call **Finish Action** later, when the work is really done, for example at the end of a timeline or from a timer.

:::warning

Every path through your action must end in **Finish Action**, including early exits such as *nothing to do*. Until it's called, the reaction waits. Compiling the Blueprint warns you if Finish Action is never called anywhere.

:::

The most useful stuff:

| Node or event | Use it for |
| --- | --- |
| **Get Target**, **Get Instigator**, **Get Event**, **Get Context** | Read the run's context anywhere, such as after a Delay or in a timer. |
| **On Cancel** | The reaction was stopped while your action was running. Stop timers, sounds and timelines here. You don't need to call Finish Action. |
| **Cleanup** | The actor is ending play. Unbind anything you bound. |
| **On Reset** | Reset All Reactions was called. Clear any state your action keeps. |
| **Requirements** (Class Defaults) | Checks that apply every time this action is used, such as *the target must have a Light component*. |

## Requirements

A requirement answers yes or no.

1. Override **Check Requirement**. Its **Context** pin has the target, the instigator and the event.
2. Return **true** if the check passes.
3. If it fails, also set **Fail Reason** to something a designer can act on, such as *"Target has no Light component"*. It shows in the log and the debug overlay.

Don't handle **Not** yourself: it's applied for you, so always write the plain check.

:::note

Requirements are shared and checked often. Don't change anything in the world from Check Requirement; only look.

:::

## Rules

A rule is a limit with memory. It keeps its own variables between runs, one copy per reaction per actor.

| Event | When it runs | Typical use |
| --- | --- | --- |
| **Should Block** | Before every run. Return true to stop it. | *Not if it's daytime*, *not more than 3 times* |
| **On Start** | A run begins. | Count activations, note the time |
| **On Finish** | A run ends, with its **Result** (Succeeded, Failed or Cancelled). | Start a cooldown after it finishes |
| **On Reset** | Reset All Reactions was called. | Put your counters back to zero |
| **Get Debug String** | Every frame while the debug overlay is on. | Show live state, such as *2/3* or *1.4s left* |

## Triggers

A trigger watches for something and sends its event.

1. In **On Activate**, start watching: usually you would bind to something, an interaction, a sensor.
2. When it happens, call **Fire Trigger**, passing whoever caused it as the **Instigator**. The trigger checks its rules and conditions and sends its event for you.
3. In **On Deactivate**, stop watching: unbind and clear timers.

Optional: **On Tick** for things you have to check every frame (the trigger only ticks if you use it), and **On Fired** for extras after it fires, such as a sound on the trigger itself.

:::tip

**Get Actor** gives you the actor the trigger is on, so you can bind to its components.

:::

## Your own row titles

Every piece shows a one-line summary as its row title in the Details panel. Override **Get Summary** to write your own, such as *"Flicker 3x over 2s"*. Build it from your custom variables only: it runs in the editor, not during play. Return nothing to keep the default.

## Catch setup mistakes: Validate Settings

Override **Validate Settings** (Functions > Override) to report problems with a block's settings. Add text to **Errors** for things that stop it working ("Sound isn't set") and to **Warnings** for things that are probably a mistake. They show up in Data Validation and Map Check, labelled with the actor, reaction and block, so designers find them before pressing Play. Only read the block's own variables here, like Get Summary.

:::note

Validate Settings checks each *placed* copy of your block, with the settings it was given there: in a level, on a Blueprint's Reaction Component, or in a Reaction Preset. It doesn't run when you validate the action Blueprint itself, because its Class Defaults are usually left empty on purpose. To see your messages, use the block in a reaction, then run **Build > Map Check**, or right-click the Reaction Preset (or the Blueprint with the Reaction Component) and choose **Validate Assets**.

:::

## Remembering things across saves: SaveGame

If a rule, trigger or action keeps something between runs (a count, an "already done" flag), tick **SaveGame** on that variable (in its details, under Advanced). It's then saved and loaded with the level. Nothing else is needed. See [Save and Load](./save-and-load.md) for how the level's state reaches your save.

| Save it | Don't save it (Data Validation warns) |
| --- | --- |
| Counts, true/false flags, enums, names, Gameplay Tags | Actor or component references: save the actor's **Identity Tag** instead, and find it with Get Actors By Identity |
| Durations and "seconds left" | Timer Handles: let the timer start again after loading, or use the built-in **Cooldown** rule |

Requirements only check the moment and are never saved, so SaveGame does nothing on them.

## Actions that only work inside a reaction

Some actions make no sense run on their own (for example ones holding lists of other actions, like Branch). Untick **Available in Blueprint Run Action** in the action's Class Defaults (under Advanced) and the plugin refuses to run it on its own from Blueprint. It still works normally inside a reaction.

## For programmers: C++

The same four classes are there in C++: `UReactiveAction`, `UReactiveRequirement`, `UReactiveRule` and `UReactiveTrigger`. The built-in ones are the best examples: actions in `Actions/FlowActions`, `EventActions`, `WorldActions` and `PresentationActions` (or `BuiltInActions.h` for all of them), plus `BuiltInRequirements`, `BuiltInRules` and `BuiltInTriggers`. In C++, override `DescribeAction`, `DescribeRequirement`, `DescribeTrigger` (or `BuildSummary` for rules) for the row title, and `ValidateSettings_Implementation` for checks. The plugin's `Docs/CppAPI.md` lists what's meant for extending, what's internal, the rules it enforces (Finish Action once per run, never run the same action object twice at once), and the log category and stats.

:::note

Prefix your classes `ACT_`, `REQ_`, `RULE_` and `TRG_` (or `UACT_`... in C++), so they sort together and are easy to find in pickers.

:::
