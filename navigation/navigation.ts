import {ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

export async function pagination(interaction: ChatInputCommandInteraction, pages: EmbedBuilder[], buttons: ButtonBuilder[], time: number = 60000) {
  const initialButtons = [];

  // There's probably a better way to do this but my brain is fried.
  if (buttons.length === 5) {
    initialButtons.push(buttons[0].setDisabled(true));
    initialButtons.push(buttons[1].setDisabled(true));
    initialButtons.push(buttons[2].setDisabled(false));
    initialButtons.push(buttons[3].setDisabled(false));
  }

  if (buttons.length === 2) {
    initialButtons.push(buttons[0].setDisabled(true));
    initialButtons.push(buttons[1].setDisabled(false));
  }

  let isComponent: boolean = false;
  await interaction.deferReply();

}