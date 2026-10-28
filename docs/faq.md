---
id: faq
title: "FAQ and Troubleshooting"
sidebar_label: "FAQ and Troubleshooting"
sidebar_position: 8
description: "Why didn't my reaction fire? And other common questions."
---

# FAQ and Troubleshooting

## My reaction didn't fire

Turn on `Reactions.Show 1`, trigger the event again, then run `Reactions.History`. Then check these, most common first:

1. **The tags don't match.** Matching only goes from parent to child. A reaction listening for `Event.Door` hears `Event.Door.Open`, but a reaction listening for `Event.Door.Open` does **not** hear `Event.Door`.
2. **The scope is too narrow.** An event sent with **Self** scope only reaches the actor that sent it. With **Identity** scope, the receiving actor needs that identity in its **Identity Tags**.
3. **A rule blocked it.** A Max Activations of 1 that has already been used stays used until **Reset All Reactions**. The overlay shows *blocked by ...*.
4. **It's switched off.** Check **Enabled** on the reaction, on the trigger, and on each action.
5. **Events are suspended.** Something called **Suspend Events** and never called **Resume Events**. To test, resume them from the console with `Reactions.Suspend 0`.
6. **It's still running.** With **Retrigger** set to *Ignore*, an event that arrives while the reaction is running is ignored.
7. **It was sent with React To.** Calling **React To** on a component directly only runs that component's reactions. Nothing else hears it, and the history doesn't record it. Use **Broadcast Event To Actor** instead.

:::tip

`Reactions.Broadcast Event.Your.Tag` sends the event from the console. If the reaction fires then, the problem is in whatever was meant to send it.

:::

## My reaction starts but gets stuck

An action is waiting and never finishes. The overlay shows which action it's on, and flags it after 15 seconds by default.

- **A custom action never calls Finish Action**, often on one path only, such as an early *return* when there's nothing to do.
- **It's waiting on purpose**: a **Wait For Event** whose event never comes, a **Play Level Sequence** on a looping sequence, or a **Play Sound** with *Wait Until Finished* on a long sound.

## An action was skipped

One of its requirements failed. The log (and the overlay) says which one and why.

If the whole reaction stopped at that action instead, it has **Stop Reaction If Not Met** ticked (its row says *stops if not met*). The overlay and log say which requirement stopped it.

- **Check** might be pointing at the wrong actor: the **Target** is the actor being acted on, and the **Instigator** is whoever caused the event.
- If the requirement checks the instigator, make sure an **Instigator** was passed when the event was sent. Broadcast Event and Fire Trigger have an Instigator pin, and Run Reaction Preset takes one in its Context. A Reactive Volume uses the actor that walked in.

## "Only once" happens once per lamp, not once in total

That's by design: every actor keeps its own count.

To make something happen once across the whole level, put the rule on one actor (or one trigger) that sends an event to the others. Or block it forever, by setting a variable somewhere that a Requirement checks.

For anything counted across the whole game ("the first time anyone does this", "the third time", "all three notes read"), keep the state in your own game's system, such as a fact database or a Game Instance variable. Make a small Blueprint action that changes it and a Blueprint requirement that checks it, and your reactions can use both like built-in blocks. If that system needs to clear itself when **Reset All Reactions** is called, C++ can listen to the subsystem's `OnReset`.

## Do I need a new Blueprint class for every reactive actor?

No. That's the point of the plugin. Add a Reaction Component to an actor placed in the level, and build its behaviour in the Details panel. Use a **Reaction Preset** to share the same setup between actors. This means anything that you place in the World can be a Reactor, even Static Meshes, Volumes, Lights... you name it.

## My custom action doesn't appear in the dropdown

- Compile and save the Blueprint.
- Check its parent class is **Reactive Action** (or Requirement, Rule or Trigger, for the matching dropdown).
- Make sure you're looking in the right list. Actions only appear in Actions lists, requirements in Requirements and Conditions lists, and so on.

## The tag picker is empty, or shows the wrong tags

The pickers only show tags under the roots set in **Project Settings → Plugins → Reactive Actors**. Check **Event Tag Root** and **Identity Tag Root**, or clear them to see every tag.

## Does it cost performance?

Very little. Nothing happens until an event is sent, and only the actors listening for it do any work. Only triggers that check something every frame use **On Tick**, and only while their actor is playing.

To measure it, type `stat Reactions` in the console while playing. It shows the time spent sending events, reacting, running actions and checking requirements, and how many of each happened this frame.

## Does it save and load?

Yes. Max Activations counts, Cooldown time left, reactions switched off, and any SaveGame variables in your own rules and triggers are saved. Reactions that were part-way through running start fresh after a load. The plugin hands you its state to store in whatever save system you use. See [Save and load](./guides.md#save-and-load) in Guides for the steps.

## Does it work in multiplayer?

Reactive Actors is built for single-player games. Events and reactions run where they're sent and aren't replicated. Maybe one day, eventually, we'll make something work for multiplayer.

## Nothing happens when I walk into a Reactive Volume

- If **Target Actor Identity** is set, the actor walking in needs a Reaction Component with that identity (or a child of it) in its Identity Tags. Clear it to let any actor count.
- The actor needs **Generate Overlap Events** ticked on its collision, as with a Trigger Box.
- Check the volume's **Conditions**: the actor walking in is both the Target and the Instigator, and if a condition fails the volume sends no Enter or Leave event for it (In Volume still counts it as inside).
- With **Event Scope** set to Identity, the volume only sends to actors with its **Target Identity**.

## Data Validation or Map Check warns about my reactions

The plugin checks your setup before you press Play: empty event tags, empty action slots, an Identity scope with no identity, a volume that does nothing, and any problems a block reports from its own **Validate Settings**. Each message names the actor, reaction and block. Run it with **Tools > Validate Data** or **Build > Map Check**, and see [Debugging and Settings](./debugging-and-settings.md#data-validation-and-map-check) for the full list.

## Can I build a quest with Wait For Event?

Better not. A reaction that's waiting isn't saved: after loading, it's gone and whatever came after the wait never happens. Restarting it instead would repeat what it did before the wait, like adding to a fact twice. Keep progress in data and give each step its own reaction: see [Multi-step goals](./guides.md#multi-step-goals-quests) in Guides. Wait For Event is for short, local moments, and has an optional **Timeout**.

## Still stuck?

Run `Reactions.History 50` and `Reactions.DumpActors`, and include the output with your question.
