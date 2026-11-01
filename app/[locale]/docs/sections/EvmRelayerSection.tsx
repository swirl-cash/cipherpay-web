'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function EvmRelayerSection() {
  return (
    <>
      <SectionTitle>Why submission routes exist</SectionTitle>
      <Paragraph>A private transaction still needs to reach an EVM network and pay for execution. SWIRL supports different submission routes so users can choose between direct control and reduced reliance on their public wallet for gas and submission.</Paragraph>

      <SectionDivider />
      <SectionTitle>Direct wallet submission</SectionTitle>
      <Paragraph>The public EVM account signs and submits the transaction and pays network gas directly. This route is operationally simple, but it creates a public relationship between that account and the vault interaction.</Paragraph>

      <SectionDivider />
      <SectionTitle>Independent Relayer submission</SectionTitle>
      <Paragraph>A Relayer submits the user-approved transaction and pays network gas. The user pays the quoted service cost through the supported fee mechanism. The Relayer does not receive the recovery phrase or spending key and cannot arbitrarily change a valid proof into a different withdrawal.</Paragraph>
      <Paragraph>Quotes should reflect current network conditions rather than a permanently fixed gas number. A Relayer can decline service, and its availability does not change the underlying ownership of an unspent note.</Paragraph>

      <SectionDivider />
      <SectionTitle>Private Pools of Innocence</SectionTitle>
      <Paragraph>PPOI is a screening and proof framework associated with protocol participation. List Providers maintain lists used by the system; nodes and wallets can perform checks around deposits, transaction construction and submission. A Relayer may apply its own submission policy in addition to wallet-side checks.</Paragraph>
      <Paragraph>PPOI is not an identity account and does not prove that a person is innocent. It is a technical process for evaluating listed blockchain activity and producing the associated proof or status. Its guarantees depend on the list, node, deployment and integration actually in use.</Paragraph>
      <Callout type="info">PPOI does not remove public blockchain records, replace legal review or make a transaction anonymous. Read it as one infrastructure component with a defined role and defined trust assumptions.</Callout>
    </>
  );
}
