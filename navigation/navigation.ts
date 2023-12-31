import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder, Message,
  MessageActionRowComponentBuilder
} from "discord.js";

export async function pagination(interaction: ChatInputCommandInteraction, pages: EmbedBuilder[], buttons: ButtonBuilder[], time: number = 60000) {
  const initialButtons: ButtonBuilder[] = [];

  if (buttons.length === 5) {
    initialButtons.push(buttons[0].setDisabled(true));
    initialButtons.push(buttons[1].setDisabled(true));
    initialButtons.push(buttons[2].setDisabled(false));
    initialButtons.push(buttons[3].setDisabled(false));
    initialButtons.push(buttons[4].setDisabled(false));
  }

  if (buttons.length === 2) {
    initialButtons.push(buttons[0].setDisabled(true));
    initialButtons.push(buttons[1].setDisabled(false));
  }

  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(initialButtons)
  let currentPage: number = 1;
  await interaction.deferReply();
  const message: Message = await interaction.editReply({
    embeds:[pages[0].setFooter({text:`Page ${currentPage}/${pages.length}`})],
    components:[row]
  });
  const filter = (interaction: any) => interaction.message.id === message.id;
  const collector = message.channel.createMessageComponentCollector({ filter, time:time})
  collector.on('collect', async (collected: any) => {
    const update = async () => {
      if (currentPage === 1) {
        if (buttons.length === 5) {
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(true);
          row.components[2].setDisabled(false);
          row.components[3].setDisabled(false);
          row.components[4].setDisabled(false);
        } else {
          row.components[0].setDisabled(true);
          row.components[1].setDisabled(false);
        }
      } else if (currentPage === pages.length) {
        if (buttons.length === 5) {
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(false);
          row.components[2].setDisabled(false);
          row.components[3].setDisabled(true);
          row.components[4].setDisabled(true);
        } else {
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(true);
        }
      } else {
        if (buttons.length === 5) {
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(false);
          row.components[2].setDisabled(false);
          row.components[3].setDisabled(false);
          row.components[4].setDisabled(false);
        } else {
          row.components[0].setDisabled(false);
          row.components[1].setDisabled(false);
        }
      }
      await message.edit({embeds:[pages[currentPage-1].setFooter({text:`Page ${currentPage}/${pages.length}`})],components:[row]});
    }
    collector.resetTimer();
    collected.deferUpdate();
    switch (collected.customId) {
      case 'first':
        currentPage = 1;
        await update();
        break;
      case 'previous':
        if (currentPage === 1) break;
        currentPage -= 1;
        await update();
        break;
      case 'next':
        if (currentPage === pages.length) break;
        currentPage += 1;
        await update();
        break;
      case 'last':
        currentPage = pages.length;
        await update();
        break;
      case 'number':
        const ask: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Quel page tu veux voir ?** \`[1 - ${pages.length - 1}]\``)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await message.edit({embeds:[pages[currentPage - 1], ask],components:[]});
        const filter = (interaction: any) => interaction.channelId === collected.channel.id && collected.member.id === interaction.author.id;
        const collector2 = message.channel.createMessageCollector({ filter, time:20000});
        collector2.on('collect', async (collected: any) => {
          collected.delete();
          if (collected.content > 0 && collected.content <= pages.length) {
            currentPage = parseInt(collected.content);
            await update();
          } else {
            await collected.reply({content:`> <:F_arrows:1190482623542341762> **La page demandée n'existe pas**\n\n> \`[1 - ${pages.length - 1}]\``, ephemeral:true});
          }
        });
        collector2.on('end', async () => {
          await update();
        });
    }
  });
  collector.on('end', () => {
    message.edit({embeds:[pages[currentPage - 1]],components:[]});
  })
}