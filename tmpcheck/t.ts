import { consolidateInvestorProfile } from "../src/application/profiling/use-cases/consolidate-investor-profile";
import { buildStrategicPortfolio } from "../src/application/allocation/use-cases/build-strategic-portfolio";
const prof = consolidateInvestorProfile({behavioralScore:62, discovery:{age:41,netWorth:1500000,monthlyIncome:40000,monthlyExpenses:18000,emergencyReserve:"entre_6_e_12_meses",isRetired:false,dependents:1,horizonYears:12,mainGoal:"aposentadoria",liquidityNeed:"baixa"}, selectedVolatility:12});
console.log(JSON.stringify(prof).slice(0,400));
const r = buildStrategicPortfolio({profile:prof, requestedVolatility:12, educationalSimulation:false});
console.log(JSON.stringify(r).slice(0,600));
console.log("keys:", Object.keys(r as any));
