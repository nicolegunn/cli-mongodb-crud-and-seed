#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { auctionCategories } from "./constants.js";
import {
  addItem,
  findItems,
  updateItem,
  removeItem,
  listItems,
  seedItems,
} from "./index.js";

const getCategoryPrompt = () => {
  return [
    {
      type: "list",
      name: "category",
      message: "Select Item Category",
      choices: auctionCategories.map((category, index) => ({
        name: `${index + 1}. ${category}`,
        value: category,
      })),
    },
  ];
};

const questions = [
  ...getCategoryPrompt(),
  { type: "input", name: "title", message: "Auction Title" },
  { type: "input", name: "description", message: "Item Description" },
  { type: "input", name: "start_price", message: "Start Price" },
  { type: "input", name: "reserve_price", message: "Reserve Price" },
];

const program = new Command();
program.version("1.0.0").description("Auction Item Management System");

program
  .command("add")
  .alias("a")
  .description("Add an item")
  .action(() => {
    inquirer.prompt(questions).then((answers) => addItem(answers));
  });

program
  .command("find <item_name>")
  .alias("f")
  .description("Find an item")
  .action((item_name) => findItems(item_name));

program
  .command("update <_id>")
  .alias("u")
  .description("Update an auction item")
  .action((_id) => {
    inquirer.prompt(questions).then((answers) => updateItem(_id, answers));
  });

program
  .command("remove <_id>")
  .alias("r")
  .description("Remove an item")
  .action((_id) => removeItem(_id));

program
  .command("list")
  .alias("l")
  .description("List all items")
  .action(() => listItems());

program
  .command("seed")
  .alias("s")
  .description("Seed the database with initial data")
  .action(() => seedItems());

program.parse(process.argv);
