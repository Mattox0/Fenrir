import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

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

export const numeros1: ActionRowBuilder = new ActionRowBuilder()
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
export const numeros2: ActionRowBuilder = new ActionRowBuilder()
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
export const numeros3: ActionRowBuilder = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('seven')
      .setEmoji('7️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('height')
      .setEmoji('8️⃣')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nine')
      .setEmoji('9️⃣')
      .setStyle(ButtonStyle.Secondary),
  )

export const allButtons: ButtonBuilder[] = [firstPageButton, previousPageButton, numberPageButton, nextPageButton, lastPageButton];
export const buttons: ButtonBuilder[] = [previousPageButton, nextPageButton];