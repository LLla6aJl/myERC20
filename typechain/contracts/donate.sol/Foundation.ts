/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface FoundationInterface extends utils.Interface {
  functions: {
    "description()": FunctionFragment;
    "donate()": FunctionFragment;
    "donationReceiver()": FunctionFragment;
    "getDonators()": FunctionFragment;
    "getSumOfDonations()": FunctionFragment;
    "investors(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "payments(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "sendHelp(uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateFoundationDescription(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "description"
      | "donate"
      | "donationReceiver"
      | "getDonators"
      | "getSumOfDonations"
      | "investors"
      | "owner"
      | "payments"
      | "renounceOwnership"
      | "sendHelp"
      | "transferOwnership"
      | "updateFoundationDescription"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "description",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "donate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "donationReceiver",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDonators",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSumOfDonations",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "investors",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payments",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sendHelp",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateFoundationDescription",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "description",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "donate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "donationReceiver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDonators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSumOfDonations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "investors", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payments", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendHelp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateFoundationDescription",
    data: BytesLike
  ): Result;

  events: {
    "Donate(address,uint256)": EventFragment;
    "DonationWithdrawal(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Received(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Donate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DonationWithdrawal"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Received"): EventFragment;
}

export interface DonateEventObject {
  donation: string;
  amount: BigNumber;
}
export type DonateEvent = TypedEvent<[string, BigNumber], DonateEventObject>;

export type DonateEventFilter = TypedEventFilter<DonateEvent>;

export interface DonationWithdrawalEventObject {
  donationReceiver: string;
  amount: BigNumber;
}
export type DonationWithdrawalEvent = TypedEvent<
  [string, BigNumber],
  DonationWithdrawalEventObject
>;

export type DonationWithdrawalEventFilter =
  TypedEventFilter<DonationWithdrawalEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface ReceivedEventObject {
  arg0: string;
  arg1: BigNumber;
}
export type ReceivedEvent = TypedEvent<
  [string, BigNumber],
  ReceivedEventObject
>;

export type ReceivedEventFilter = TypedEventFilter<ReceivedEvent>;

export interface Foundation extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FoundationInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    description(overrides?: CallOverrides): Promise<[string]>;

    donate(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationReceiver(overrides?: CallOverrides): Promise<[string]>;

    getDonators(overrides?: CallOverrides): Promise<[string[]]>;

    getSumOfDonations(overrides?: CallOverrides): Promise<[BigNumber]>;

    investors(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    payments(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    sendHelp(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateFoundationDescription(
      _description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  description(overrides?: CallOverrides): Promise<string>;

  donate(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationReceiver(overrides?: CallOverrides): Promise<string>;

  getDonators(overrides?: CallOverrides): Promise<string[]>;

  getSumOfDonations(overrides?: CallOverrides): Promise<BigNumber>;

  investors(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  payments(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  sendHelp(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateFoundationDescription(
    _description: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    description(overrides?: CallOverrides): Promise<string>;

    donate(overrides?: CallOverrides): Promise<void>;

    donationReceiver(overrides?: CallOverrides): Promise<string>;

    getDonators(overrides?: CallOverrides): Promise<string[]>;

    getSumOfDonations(overrides?: CallOverrides): Promise<BigNumber>;

    investors(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    payments(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sendHelp(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateFoundationDescription(
      _description: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Donate(address,uint256)"(
      donation?: null,
      amount?: null
    ): DonateEventFilter;
    Donate(donation?: null, amount?: null): DonateEventFilter;

    "DonationWithdrawal(address,uint256)"(
      donationReceiver?: null,
      amount?: null
    ): DonationWithdrawalEventFilter;
    DonationWithdrawal(
      donationReceiver?: null,
      amount?: null
    ): DonationWithdrawalEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Received(address,uint256)"(arg0?: null, arg1?: null): ReceivedEventFilter;
    Received(arg0?: null, arg1?: null): ReceivedEventFilter;
  };

  estimateGas: {
    description(overrides?: CallOverrides): Promise<BigNumber>;

    donate(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationReceiver(overrides?: CallOverrides): Promise<BigNumber>;

    getDonators(overrides?: CallOverrides): Promise<BigNumber>;

    getSumOfDonations(overrides?: CallOverrides): Promise<BigNumber>;

    investors(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    payments(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    sendHelp(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateFoundationDescription(
      _description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    description(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    donate(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationReceiver(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDonators(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSumOfDonations(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    investors(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    payments(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    sendHelp(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateFoundationDescription(
      _description: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}