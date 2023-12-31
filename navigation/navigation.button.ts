import {ButtonBuilder, ButtonStyle} from "discord.js";

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

export const allButtons: ButtonBuilder[] = [firstPageButton, previousPageButton, numberPageButton, nextPageButton, lastPageButton];
export const buttons: ButtonBuilder[] = [previousPageButton, nextPageButton];