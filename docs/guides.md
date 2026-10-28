---
id: guides
title: "Guides"
sidebar_label: "Guides"
sidebar_position: 4
description: "Short recipes for common jobs: areas, only once, locked doors, randomness, save and load."
---

# Guides

Short recipes for common jobs. Each one uses only built-in pieces unless it says otherwise. If a term is new to you, [Core Concepts](./core-concepts.md) explains it.

## Make something happen when the player enters an area

Use a **Reactive Volume**:

1. Give your player pawn a **Reaction Component** with `Actor.Player` in its **Identity Tags** (it doesn't need any reactions).
2. Drag a **Reactive Volume** in from **Place Actors > Reactive** and size it with **Size** or the scale tool.
3. Set **Target Actor Identity** to `Actor.Player`, so only the player counts.
4. Set **Enter Event** to your event, such as `Event.Kitchen.Entered`, and **Leave Event** if you want one.
5. Optional: give it **Volume Identity Tags** such as `Actor.Room.Kitchen`, so reactions anywhere can use the **In Volume** requirement ("only if the player is in the kitchen").

Every actor listening for `Event.Kitchen.Entered` now reacts when the player walks in, with the player as the **Instigator**. Add a **Max Activations** rule to those reactions if it should only happen once.

:::tip

For anything more particular than an identity ("only while carrying the lantern"), add requirements to the volume's **Conditions**. Each check sees the actor coming in as both Target and Instigator.

:::

## Make something happen only once

A scare should play the first time the player walks into the room, never again.

1. On the reaction, under **Rules**, click **+** and choose **Max Activations**.
2. Leave **Max Activations** at `1`.

The count is **per actor**. If ten actors share a Preset with this rule, each of them reacts once.

:::tip

Set it to `3` for *three times only*, or `0` for no limit. To make a *trigger* fire only once, add the same rule to the trigger's Rules.

:::

## Stop something from repeating too quickly

A floorboard creaks when stepped on, but shouldn't creak ten times a second.

1. On the reaction, add a **Cooldown** rule.
2. Set **Cooldown Seconds** to how long to wait after it finishes, e.g. `2`.

## A locked door: do one thing or another

The door opens if the player has the key, and rattles if not. Use a **Branch** action, which checks its **Conditions** and runs either its **True Actions** or its **False Actions**.

1. Give the player the actor tag `HasKey` when they pick up the key (**Details → Actor → Tags**, or the *Add Tag* node in Blueprint).
2. On the door's reaction to `Event.Door.Use`, add a **Branch** action.
3. Under **Conditions**, add **Has Actor Tags**: set **Check** to **Instigator** and add the tag `HasKey`.
4. Under **True Actions**, add whatever opens the door.
5. Under **False Actions**, add a **Play Sound** with a rattle.

When the player uses the door, send `Event.Door.Use` with the player as the **Instigator**, so the condition knows who to check.

:::tip

A Branch can hold more Branches, and its **Evaluate Mode** chooses between *All Conditions* (every one must pass) and *Any Condition* (one is enough).

:::

## Chain reactions together

When the lights go out, the TV should switch on a second later.

- Inside one reaction, use a **Broadcast Event** action as a step: *Delay 1s → Broadcast Event `Event.TV.On`*.
- Or put an **Event Received** trigger on the TV: when it hears `Event.Lights.Off`, it sends `Event.TV.On`.

Use the first when one actor drives the sequence, and the second when the TV should decide for itself.

## Affect many actors at once

The power cut should switch off every light in the kitchen.

1. Give each kitchen light the identity `Actor.Kitchen.Light` in its Reaction Component's **Identity Tags**.
2. Pick one of these:
   - **Send them an event**: a **Broadcast Event** action with **Event Scope** set to **Identity** and **Target Identity** set to `Actor.Kitchen`. Each light reacts with its own reactions.
   - **Do the actions for them**: a **Run On Targets** action with **Target Identity** `Actor.Kitchen`, holding the actions to run. Every light runs them at the same time, and the lights need no reactions of their own.

Use the event when the lights should behave differently from each other. Use Run On Targets when they should all do exactly the same thing.

## Add randomness

- **Pick one of several outcomes**: a **Random Action** holds a list of **Options**, each with its own actions and a **Weight**. A weight of 2 is twice as likely as 1. Tick **Avoid Repeat** so the same option never comes up twice in a row.
- **Only sometimes**: add a **Random Chance** requirement to an action (it's skipped the rest of the time), or to a trigger's Conditions.
- **Uneven timing**: a **Timer** trigger's **Random Deviation** adds or takes away up to that many seconds each time.

## Wait for something in the middle of a reaction

The music box plays, then waits until the player closes the lid, then stops.

1. In the reaction's actions, add **Wait For Event** where it should pause.
2. Set **Event** to the event to wait for, such as `Event.MusicBox.Closed`.

The reaction waits there as long as it takes. If the event never comes, it simply waits until the reaction is cancelled or the actor is removed. Set **Listen Scope** to **Identity** to only accept the event when it's sent to a particular identity.

## Play a cutscene in a reaction

Add a **Play Level Sequence** action. By default the reaction waits for the sequence to end before the next action. Untick **Wait For Sequence To Finish** to carry on straight away.

:::warning

Don't wait on a looping sequence: it never finishes, so the reaction never carries on.

:::

## Pause all reactions during a cutscene or menu

Call **Suspend Events** in Blueprint. Every event is ignored until you call **Resume Events**. Reactions already running carry on; to stop those too, call **Cancel All Reactions**.

## Reset for a checkpoint or New Game

Call **Reset All Reactions** to put every reaction back as if it had never fired: running ones are cancelled, Max Activations counts go back to zero and cooldowns clear. There are versions for one actor, one identity or one event.

Inside a reaction, the **Reset Reactions** action does the same for its target, and **Set Reaction Enabled** switches its target's reactions on or off.

## Share reactions between many actors

Twenty lamps should all behave the same way. Instead of setting each one up by hand:

1. In the Content Browser, right-click and choose **Reactive → Reaction Preset**.
2. Open it and add the reactions and triggers once.
3. On each lamp's Reaction Component, set **Preset** to it.

Change the Preset and every lamp updates. A lamp can still have its own extra reactions next to the Preset's.

## React from a widget, manager or level Blueprint

Not everything that cares about events is an actor in the level. In any Blueprint, use the **Wait For World Event** node (or **Wait For Identity Event**):

1. Add the node with your event tag. Its **On Event** pin fires every time the event is sent, with the **Event** and the **Instigator**.
2. Tick **Only Once** to stop after the first one, or keep the **Async Action** pin and call **Cancel** on it to stop listening.

It stops on its own when the Blueprint that created it is destroyed, or the level ends.

:::tip

From **On Event** you can call **Run Reaction Preset** to run a Reaction Preset's actions without a Reaction Component. Set the Target and Instigator in its **Context** pin, and use **On Finished** or **On Blocked** to carry on afterwards.

:::

## Save and load

Reactive Actors remembers what each reaction has done (Max Activations counts, Cooldowns, reactions switched off) and hands it to your game as one **Reactive World State** value per level, to store in whatever save system you use. In short:

1. When saving, put **Get World Reaction State** in your save.
2. When loading, call **Set World Reaction State** with it, before **Open Level** or in the Game Mode's **Begin Play**.

Streaming and World Partition are handled for you. [Save and Load](./save-and-load.md) has the full setup: several levels, other save systems, spawned actors, and your own blocks.

## Multi-step goals (quests)

Reactions are reflexes: *when this happens, do this*, over a few seconds. Don't chain **Wait For Event** actions into a quest. A waiting reaction isn't saved, so after a load it's gone, and the steps after the wait never happen.

Instead, keep each step's progress in data, such as your own fact database or a variable on your Game Instance, and give each step its own reaction:

1. Make a Blueprint action that sets a fact (for example *Set Fact*), and a Blueprint requirement that checks one (*Fact Is*).
2. Each note's reaction, on being read: **Set Fact** `Notes.Read.A` to 1.
3. The door: a reaction to any note being read, with the requirement **Fact Is** for all three notes, that unlocks it.

It works in any order, it saves with your facts, and each step can be tested on its own. For long branching story, use a tool made for it, such as Flow.
