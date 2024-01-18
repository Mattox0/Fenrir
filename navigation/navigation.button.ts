import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder} from "discord.js";

const firstPageButton: ButtonBuilder = new ButtonBuilder()
  .setCustomId('first')
  .setEmoji('⏮️')
  .setStyle(ButtonStyle.Primary);

const previousPageButton: ButtonBuilder = new ButtonBuilder()
  .setCustomId('previous')
  .setEmoji('◀️')
  .setStyle(ButtonStyle.Primary);

const numberPageButton: ButtonBuilder = new ButtonBuilder()
  .setCustomId('number')
  .setEmoji('🔢')
  .setStyle(ButtonStyle.Primary);

const nextPageButton: ButtonBuilder = new ButtonBuilder()
  .setCustomId('next')
  .setEmoji('▶️')
  .setStyle(ButtonStyle.Primary);

const lastPageButton: ButtonBuilder = new ButtonBuilder()
  .setCustomId('last')
  .setEmoji('⏭️')
  .setStyle(ButtonStyle.Primary);

export const numeros1: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('one')
      .setEmoji('1️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('two')
      .setEmoji('2️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('three')
      .setEmoji('3️⃣')
      .setStyle(ButtonStyle.Secondary),
  )

export const numeros2: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('four')
      .setEmoji('4️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('five')
      .setEmoji('5️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('six')
      .setEmoji('6️⃣')
      .setStyle(ButtonStyle.Secondary),
  )

export const numeros3: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('seven')
      .setEmoji('7️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('eight')
      .setEmoji('8️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nine')
      .setEmoji('9️⃣')
      .setStyle(ButtonStyle.Secondary),
  )

export const numbers1to4: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('number_1')
      .setEmoji('1️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('number_2')
      .setEmoji('2️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('number_3')
      .setEmoji('3️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('number_4')
      .setEmoji('4️⃣')
      .setStyle(ButtonStyle.Secondary)
  )

export const numbers5to7: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('number_5')
      .setEmoji('5️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('number_6')
      .setEmoji('6️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('number_7')
      .setEmoji('7️⃣')
      .setStyle(ButtonStyle.Secondary),
  )

export const allButtons: ButtonBuilder[] = [firstPageButton, previousPageButton, numberPageButton, nextPageButton, lastPageButton];