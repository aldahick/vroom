import { Injectable } from "@nestjs/common";
import * as _ from "lodash";

@Injectable()
export class StateNameService {
  getIdFromName(name: string) {
    return _.findKey(StateNames, v => v.toLowerCase() === name);
  }
}

export enum StateNames {
  AK = "Alaska",
  AL = "Alabama",
  AR = "Arizona",
  AS = "Arkansas",
  AZ = "Arizona",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DC = "Washington, D.C.",
  DE = "Delaware",
  FL = "Florida",
  GA = "Georgia",
  GU = "Guam",
  HI = "Hawaii",
  IA = "Iowa",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  MA = "Massachusetts",
  MD = "Maryland",
  ME = "Maine",
  MI = "Michigan",
  MN = "Minnesota",
  MO = "Missouri",
  MP = "Mariana Islands",
  MS = "Mississippi",
  MT = "Montana",
  NC = "North Carolina",
  ND = "North Dakota",
  NE = "Nebraska",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NV = "Nevada",
  NY = "New York",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VA = "Virginia",
  VI = "Virgin Islands",
  VT = "Vermont",
  WA = "Washington",
  WI = "Wisconsin",
  WV = "West Virginia",
  WY = "Wyoming"
}
