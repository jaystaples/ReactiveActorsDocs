---
id: getting-started
title: "Getting Started"
sidebar_label: "Getting Started"
sidebar_position: 2
description: "Install the plugin and build your first reaction in about ten minutes."
---

# Getting Started

This page takes you from a fresh install to a working reaction in about ten minutes. You'll install the plugin, set up your tags, make a prop react when the level starts, then make your own action.

## 1. Install the plugin

1. Close the Unreal Editor.
2. Copy the `ReactiveActors` folder (and `ReactiveActorsExtras`, if you want the extra actions) into your project's `Plugins` folder. Create the folder next to your `.uproject` file if it doesn't exist yet.
3. Open your project. If Unreal asks to rebuild missing modules, click **Yes**.
4. Go to **Edit → Plugins**, search for *Reactive Actors*, and make sure it's ticked.

:::note

The plugin ships as source code, so your project needs to be able to compile C++. If your project is Blueprint-only, add any C++ class once (**Tools → New C++ Class**) so Unreal can build plugins.

:::

## 2. Set up your tags

Reactive Actors uses **Gameplay Tags** as the names of events. A tag is just a dotted name like `Event.Door.Open`. Using tags instead of typed text means no typos, and parents match children: a reaction listening for `Event.Door` also hears `Event.Door.Open`.

1. Open **Project Settings → Gameplay Tags** and add a few tags under two roots:
   - `Event` for things that happen, e.g. `Event.Door.Open`, `Event.Photo.PickedUp`
   - `Actor` for naming actors, e.g. `Actor.Kitchen.Lamp`
2. Open **Project Settings → Plugins → Reactive Actors** and set **Event Tag Root** to `Event` and **Identity Tag Root** to `Actor`. Or pick whatever you like.

Now every event picker only shows `Event` tags, and every identity picker only shows `Actor` tags.

:::tip

You can also create tags straight from any tag picker with **Add New Gameplay Tag**, so you don't have to plan them all up front.

:::

**Naming your tags.** Pick a pattern early, before you have hundreds. A good default is *place, then thing, then what happened*: `Event.Kitchen.Door.Opened`, `Event.Attic.Lights.Off`. Because parents match children, this lets one reaction listen for `Event.Kitchen` (anything in the kitchen) or `Event.Kitchen.Door` (anything the kitchen door does). Use past tense for things that happened (*Opened*, *PickedUp*) so events read as facts, not commands.

## 3. Your first reaction

We'll make a prop that plays a sound and vanishes three seconds after the level starts. It only uses built-in pieces.

### Add the component

1. Place any prop in your level, such as a cube or a chair.
2. Select it, click **Add** in the Details panel, and add a **Reaction Component**.
3. Select the Reaction Component. Its settings are under **Reactive Actors** in the Details panel.

### Add a trigger that sends an event

A **trigger** watches for something and sends an event when it happens. This one is a timer.

1. Next to **Triggers**, click **+** and choose **Timer**.
2. Set **First Delay** to `3`.
3. Set **Event** to a new tag, `Event.Demo.Vanish`.
4. Set **Event Scope** to **Self**, so only this actor hears it.

### Add a reaction to that event

1. Next to **Reactions**, click **+**.
2. Set its **Event Tag** to `Event.Demo.Vanish`.
3. Under its **Actions**, click **+** twice:
   - **Play Sound**: pick any sound. Leave **Mode** on *At Target*.
   - **Set Actor Hidden**: leave **Hidden** ticked.

Each row shows a one-line summary of what it does, so you can read the whole reaction without expanding anything.

### Play it

Press **Play**. After three seconds you hear the sound and the prop disappears.

:::tip

While playing, press the backtick key (the one left of 1) to open the console, type `Reactions.Show 1` and press Enter. Every actor with a Reaction Component now shows what it's listening for and what just happened above its head. See [Debugging and Settings](./debugging-and-settings.md) for more.

:::

## 4. Send an event from Blueprint

Triggers are one way to send events. The other is from any Blueprint, with the **Broadcast Event** node.

1. In the Blueprint where something happens (the player picking up an item, a button being pressed), add a **Broadcast Event** node.
2. Set **Event** to your tag, and plug the player into **Instigator** so reactions know who caused it.
3. Every Reaction Component listening for that tag reacts.

There are also **Broadcast Event To Actor** (one actor only) and **Broadcast Event To Identity** (every actor with an identity tag, e.g. all `Actor.Kitchen` actors).

## 5. Your first custom action

When the built-in actions aren't enough, make your own. It takes a minute.

1. In the Content Browser, right-click and choose **Reactive → Reactive Action**. Name it `ACT_PrintTarget`.
2. Open it. The **Execute Action** event is already there, wired to **Finish Action**.
3. Between them, add a **Print String** node and plug **Get Target → Get Display Name** into it.
4. Compile and save.

Your action now appears in every Actions dropdown, next to the built-in ones.

:::warning

Every action **must call Finish Action** when it's done, even if it does its work later (after a timer or an animation). Until it does, the reaction waits. If you forget, compiling the Blueprint gives you a warning.

:::

## Next steps

- Read [Core Concepts](./core-concepts.md) to understand how the pieces fit together.
- Browse [Guides](./guides.md) for recipes like *only once*, *keys and doors* and *randomness*.
- Look up what each built-in piece does in [Built-in Reference](./built-in-reference.md).
