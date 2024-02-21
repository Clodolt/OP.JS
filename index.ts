import OPGG from "./lib/opgg";
import { Region } from "./lib/parameterss";

async function main() {
    try {
        const op = new OPGG();


        const summoner = await op.search(["Alakato"], Region.EUW);
        console.log(summoner);
    } catch (error) {
      console.error("Error in main function response:", error);
    }
  }
  
  main();