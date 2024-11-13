import initializeCli from "./cli";

export default async function main() {
  const configOptions = await initializeCli()
  console.log(configOptions)
}

main()
