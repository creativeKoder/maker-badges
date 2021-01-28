
import {
  allGovernancePollAddresses,
  pollVoteAddressesForFrequency,
  allExecutiveSpellAddresses,
  spellVoteAddressesForFrequency,
  allGovernancePollAddressesWithPollId,
  consecutivePollVoteAddressesForFrequency,
  allExecutiveSpellAddressesWithTimestamps,
  earlyExecutiveVoteAddressesForTime,
  allGovernancePollAddressesWithTimestamps,
  earlyPollVoteAddressesForTime,
} from "./governance";
import {
  allBitesAllFlippers,
  biteAddressesForFrequency,
  allBidAddresses,
  bidAddressesForFrequency,
  allBidGuysAllFlippers,
  bidGuyAddressesForFrequency,
} from "./auctions";
import updateTemplateRecord from '../utils/updateTemplateRecord';

/**
 * UPDATE_ROOTS()
 *
 * Root hashes - Merkel Tree for each badge
 */
export async function updateRoots() {
  return new Promise(async (resolve) => {
    // saving at least 1 dai in DSR
    console.log({ templateId: 1, dai_saved: 1 });

    // locking Dai in DSR for N (time) periods
    const daiInDsr = [
      { templateId: 2, periods: 3 },
      { templateId: 3, periods: 6 },
    ];

    daiInDsr.map(async periods => {
      console.log(periods);
    });

    // transfer N (amount) of Dai
    const daiTransferred = [
      { templateId: 4, amount: 10 },
      { templateId: 5, amount: 100 },
    ];

    daiTransferred.map(async amount => {
      console.log(amount);
    });

    // governanceVotes
    // voting on at least N (frequency) governance polls
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const governanceVoteFrequencies = [
      { templateId: 6, frequency: 1 },
      { templateId: 7, frequency: 5 },
      { templateId: 8, frequency: 10 },
      { templateId: 9, frequency: 20 },
      { templateId: 10, frequency: 50 },
      { templateId: 11, frequency: 100 },
    ];

    const govVoteAddresses = await allGovernancePollAddresses();

    governanceVoteFrequencies.map(async (freq) => {
      const govVoteAddressList = pollVoteAddressesForFrequency(freq.frequency, govVoteAddresses);
      const record = await updateTemplateRecord(govVoteAddressList, freq.templateId);
      console.log('governanceVoteFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    // voting on N (frequency) consecutive governance polls
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const consecutiveGovernancePollFrequencies = [
      { templateId: 12, frequency: 2 },
      { templateId: 13, frequency: 5 },
      { templateId: 14, frequency: 10 },
    ];
    const governancePollAddresses = await allGovernancePollAddressesWithPollId();

    consecutiveGovernancePollFrequencies.map(async freq => {
      const consecutiveAddresses = consecutivePollVoteAddressesForFrequency(freq.frequency, governancePollAddresses);
      const record = await updateTemplateRecord(consecutiveAddresses, freq.templateId);
      console.log('consecutiveGovernancePollFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // voting on at least N (frequency) executive proposals (spells)
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const executiveSpellFrequencies = [
      { templateId: 15, frequency: 1 },
      { templateId: 16, frequency: 5 },
      { templateId: 17, frequency: 10 },
      { templateId: 18, frequency: 20 },
      { templateId: 19, frequency: 50 },
    ];
    const execSpellAddresses = await allExecutiveSpellAddresses();

    executiveSpellFrequencies.map(async freq => {
      const execAddresses = spellVoteAddressesForFrequency(freq.frequency, execSpellAddresses);
      const record = await updateTemplateRecord(execAddresses, freq.templateId);
      console.log('executiveSpellFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // early voter on Executive Spell (within 60 minutes of creation)
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const earlyExecutiveVotes = [{ templateId: 20, time: 3600 }];
    const executiveAddressesWithTimestamp = await allExecutiveSpellAddressesWithTimestamps();

    earlyExecutiveVotes.map(async time => {
      const earlyExecutiveAddresses = earlyExecutiveVoteAddressesForTime(time.time, executiveAddressesWithTimestamp);
      const record = await updateTemplateRecord(earlyExecutiveAddresses, time.templateId);
      console.log('earlyExecutiveVotes.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // early voter on governance poll (within 60 minutes of start time)
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const earlyPollVotes = [{ templateId: 21, time: 3600 }];
    const govVoteAddressesWithTimestamp = await allGovernancePollAddressesWithTimestamps()

    earlyPollVotes.map(async time => {
      const addresses = earlyPollVoteAddressesForTime(time.time, govVoteAddressesWithTimestamp);
      const record = await updateTemplateRecord(addresses, time.templateId);
      console.log('earlyPollVotes.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // biting at least N (frequency) unsafe Vaults
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const bitingVaultsFrequencies = [
      { templateId: 22, frequency: 1 },
      { templateId: 23, frequency: 10 },
      { templateId: 24, frequency: 50 },
      { templateId: 25, frequency: 100 },
    ];
    const allBiteAddresses = await allBitesAllFlippers();

    bitingVaultsFrequencies.map(async freq => {
      const biteAddresses = biteAddressesForFrequency(freq.frequency, allBiteAddresses);
      const record = await updateTemplateRecord(biteAddresses, freq.templateId);
      console.log('bitingVaultsFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // bidding on at least N (frequency) collateral auctions
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const bidCollateralAuctionFrequencies = [
      { templateId: 26, frequency: 1 },
      { templateId: 27, frequency: 5 },
      { templateId: 28, frequency: 10 },
      { templateId: 29, frequency: 25 },
    ];
    const allBidAddressList = await allBidAddresses();

    bidCollateralAuctionFrequencies.map(async freq => {
      const bidAddresses = bidAddressesForFrequency(freq.frequency, allBidAddressList)
      const record = await updateTemplateRecord(bidAddresses, freq.templateId);
      console.log('bidCollateralAuctionFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // winning at least N (frequency) collateral auctions
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const winCollateralAuctionFrequencies = [
      { templateId: 30, frequency: 1 },
      { templateId: 31, frequency: 5 },
      { templateId: 32, frequency: 10 },
      { templateId: 33, frequency: 25 },
    ];
    const allBidGuyAddressList = await allBidGuysAllFlippers();

    winCollateralAuctionFrequencies.map(async freq => {
      const bidGuyAddresses = bidGuyAddressesForFrequency(freq.frequency, allBidGuyAddressList)
      const record = await updateTemplateRecord(bidGuyAddresses, freq.templateId);
      console.log('winCollateralAuctionFrequencies.updateTemplateRecord', record);
    });
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    console.log(`update-roots completed. ${process.env.ENVIRONMENT}`);
    resolve({roots: {}, success: true});

  }); // END UpdateRoots()
}
