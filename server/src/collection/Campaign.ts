import { ObjectId } from "bson";

export interface Campaign {
  _id: ObjectId;
  year: number;
  candidate: {
    id: string;
    name: string;
    isIncumbent: boolean;
    party: string;
    state: string;
    district: string;
  };
  totalReceipts: number;
  authorizedCommitteeTransfers: {
    from: number;
    to: number;
  };
  disbursements: number;
  cashOnHand: {
    initial: number;
    final: number;
  };
  contributions: {
    total: number;
    candidate: number;
    individual: number;
    pac: number;
    party: number;
  };
  loans: {
    candidate: {
      given: number;
      repaid: number;
    };
    other: {
      given: number;
      repaid: number;
    };
    owed: number;
  };
  refunds: {
    individual: number;
    committee: number;
  };
  end: Date;
}
