/** Grouped drafts first; country files override them. */
import { G00 } from "./g00";
import { G01 } from "./g01";
import { G02 } from "./g02";
import { G03 } from "./g03";
import { G04 } from "./g04";
import { G05 } from "./g05";
import { G06A } from "./g06a";
import { G06B } from "./g06b";
import { G07 } from "./g07";
import { G08 } from "./g08";
import { G09 } from "./g09";
import { G10 } from "./g10";
import { G11 } from "./g11";
import { G12 } from "./g12";
import { G13 } from "./g13";
import { G14 } from "./g14";
import { G15 } from "./g15";
import { G16 } from "./g16";
import { G17 } from "./g17";
import { G18 } from "./g18";
import { G19 } from "./g19";
import { G20 } from "./g20";
import { G21 } from "./g21";
import { G22 } from "./g22";
import { AF_STORIES } from "./af";
import { AL_STORIES } from "./al";
import { AM_STORIES } from "./am";
import { AZ_STORIES } from "./az";
import { BA_STORIES } from "./ba";
import { BY_STORIES } from "./by";
import { CY_STORIES } from "./cy";
import { EE_STORIES } from "./ee";
import { GE_STORIES } from "./ge";
import { GT_STORIES } from "./gt";
import { HN_STORIES } from "./hn";
import { IR_STORIES } from "./ir";
import { JO_STORIES } from "./jo";
import { KG_STORIES } from "./kg";
import { KZ_STORIES } from "./kz";
import { KW_STORIES } from "./kw";
import { LB_STORIES } from "./lb";
import { LT_STORIES } from "./lt";
import { LU_STORIES } from "./lu";
import { LV_STORIES } from "./lv";
import { LY_STORIES } from "./ly";
import { MD_STORIES } from "./md";
import { ME_STORIES } from "./me";
import { MK_STORIES } from "./mk";
import { MN_STORIES } from "./mn";
import { NI_STORIES } from "./ni";
import { OM_STORIES } from "./om";
import { QA_STORIES } from "./qa";
import { SV_STORIES } from "./sv";
import { TJ_STORIES } from "./tj";
import { TM_STORIES } from "./tm";
import { UZ_STORIES } from "./uz";
import { XK_STORIES } from "./xk";
import { BR_STORIES } from "./br";
import { JP_STORIES } from "./jp";
import { MX_STORIES } from "./mx";
import { PT_STORIES } from "./pt";

import { NCYP_STORIES } from "./ncyp";
import { FJ_STORIES } from "./fj";
import { SB_STORIES } from "./sb";
import { VU_STORIES } from "./vu";
import { NC_STORIES } from "./nc";
import { PG_STORIES } from "./pg";
import { TF_STORIES } from "./tf";
import { BS_STORIES } from "./bs";
import { BZ_STORIES } from "./bz";
import { GY_STORIES } from "./gy";
import { SR_STORIES } from "./sr";
import { PR_STORIES } from "./pr";
import { FK_STORIES } from "./fk";
import { TT_STORIES } from "./tt";
import { BT_STORIES } from "./bt";
import { KH_STORIES } from "./kh";
import { LA_STORIES } from "./la";
import { MM_STORIES } from "./mm";
import { BN_STORIES } from "./bn";
import { KP_STORIES } from "./kp";
import { YE_STORIES } from "./ye";
import { PS_STORIES } from "./ps";
import { SY_STORIES } from "./sy";
import { BF_STORIES } from "./bf";
import { BJ_STORIES } from "./bj";
import { CI_STORIES } from "./ci";
import { GM_STORIES } from "./gm";
import { GN_STORIES } from "./gn";
import { LR_STORIES } from "./lr";
import { SL_STORIES } from "./sl";
import { TG_STORIES } from "./tg";
import { ML_STORIES } from "./ml";
import { MR_STORIES } from "./mr";
import { NE_STORIES } from "./ne";
import { TD_STORIES } from "./td";
import { CF_STORIES } from "./cf";
import { CD_STORIES } from "./cd";
import { CG_STORIES } from "./cg";
import { GA_STORIES } from "./ga";
import { BI_STORIES } from "./bi";
import { DJ_STORIES } from "./dj";
import { ER_STORIES } from "./er";
import { RW_STORIES } from "./rw";
import { SO_STORIES } from "./so";
import { SOMALILAND_STORIES } from "./somaliland";
import { SD_STORIES } from "./sd";
import { SS_STORIES } from "./ss";
import { UG_STORIES } from "./ug";
import { BW_STORIES } from "./bw";
import { LS_STORIES } from "./ls";
import { MG_STORIES } from "./mg";
import { MW_STORIES } from "./mw";
import { NA_STORIES } from "./na";
import { SZ_STORIES } from "./sz";
import { ZM_STORIES } from "./zm";
import { ZW_STORIES } from "./zw";
import { EH_STORIES } from "./eh";

export const FULL_STORIES: Record<string, string[]> = {
  ...G00,
  ...G01,
  ...G02,
  ...G03,
  ...G04,
  ...G05,
  ...G06A,
  ...G06B,
  ...G07,
  ...G08,
  ...G09,
  ...G10,
  ...G11,
  ...G12,
  ...G13,
  ...G14,
  ...G15,
  ...G16,
  ...G17,
  ...G18,
  ...G19,
  ...G20,
  ...G21,
  ...G22,
  ...AF_STORIES,
  ...AL_STORIES,
  ...AM_STORIES,
  ...AZ_STORIES,
  ...BA_STORIES,
  ...BY_STORIES,
  ...CY_STORIES,
  ...EE_STORIES,
  ...GE_STORIES,
  ...GT_STORIES,
  ...HN_STORIES,
  ...IR_STORIES,
  ...JO_STORIES,
  ...KG_STORIES,
  ...KZ_STORIES,
  ...KW_STORIES,
  ...LB_STORIES,
  ...LT_STORIES,
  ...LU_STORIES,
  ...LV_STORIES,
  ...LY_STORIES,
  ...MD_STORIES,
  ...ME_STORIES,
  ...MK_STORIES,
  ...MN_STORIES,
  ...NI_STORIES,
  ...OM_STORIES,
  ...QA_STORIES,
  ...SV_STORIES,
  ...TJ_STORIES,
  ...TM_STORIES,
  ...UZ_STORIES,
  ...XK_STORIES,
  ...BR_STORIES,
  ...JP_STORIES,
  ...MX_STORIES,
  ...PT_STORIES,
  ...NCYP_STORIES,
  ...FJ_STORIES,
  ...SB_STORIES,
  ...VU_STORIES,
  ...NC_STORIES,
  ...PG_STORIES,
  ...TF_STORIES,
  ...BS_STORIES,
  ...BZ_STORIES,
  ...GY_STORIES,
  ...SR_STORIES,
  ...PR_STORIES,
  ...FK_STORIES,
  ...TT_STORIES,
  ...BT_STORIES,
  ...KH_STORIES,
  ...LA_STORIES,
  ...MM_STORIES,
  ...BN_STORIES,
  ...KP_STORIES,
  ...YE_STORIES,
  ...PS_STORIES,
  ...SY_STORIES,
  ...BF_STORIES,
  ...BJ_STORIES,
  ...CI_STORIES,
  ...GM_STORIES,
  ...GN_STORIES,
  ...LR_STORIES,
  ...SL_STORIES,
  ...TG_STORIES,
  ...ML_STORIES,
  ...MR_STORIES,
  ...NE_STORIES,
  ...TD_STORIES,
  ...CF_STORIES,
  ...CD_STORIES,
  ...CG_STORIES,
  ...GA_STORIES,
  ...BI_STORIES,
  ...DJ_STORIES,
  ...ER_STORIES,
  ...RW_STORIES,
  ...SO_STORIES,
  ...SOMALILAND_STORIES,
  ...SD_STORIES,
  ...SS_STORIES,
  ...UG_STORIES,
  ...BW_STORIES,
  ...LS_STORIES,
  ...MG_STORIES,
  ...MW_STORIES,
  ...NA_STORIES,
  ...SZ_STORIES,
  ...ZM_STORIES,
  ...ZW_STORIES,
  ...EH_STORIES,
};
