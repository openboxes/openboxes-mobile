import { StyleSheet } from 'react-native';

import Theme from '../../utils/Theme';

const HAIRLINE = Theme.colors.secondaryBackground;
const WHITE = '#ffffff';
// Ten sam odcień zaznaczenia, którego apka używa w AlternativeLocationSelector.
const SELECTED_ROW = '#E8F0FE';
const MOVING_BAND = '#E9EDF2';
const MOVING_DIVIDER = '#CDD4DC';

export default StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Theme.colors.background },
  // Opaque, with its own edge and elevation, so cards scroll under a defined boundary rather than
  // appearing to bleed into the grouping toggle.
  listHeader: {
    backgroundColor: Theme.colors.background,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    elevation: 2,
    zIndex: 1
  },
  listArea: { flex: 1 },
  listContent: { paddingBottom: 32 },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: Theme.colors.secondaryForeground
  },
  sectionLabelHighlighted: { color: Theme.colors.primary },
  sectionActionRow: { flexDirection: 'row', alignItems: 'center' },
  sectionAction: { fontSize: 14, fontWeight: 'bold', color: Theme.colors.primary, marginLeft: 18 },

  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: Theme.colors.text, marginLeft: 8 },

  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Theme.colors.secondaryBackground
  },
  activeFilterText: { fontSize: 13, color: Theme.colors.secondaryForeground, flexShrink: 1 },
  activeFilterClear: { fontSize: 13, fontWeight: 'bold', color: Theme.colors.primary, marginLeft: 12 },

  toggleTrack: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 4,
    borderRadius: 12,
    backgroundColor: Theme.colors.secondaryBackground
  },
  toggleButton: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  toggleButtonSelected: { backgroundColor: Theme.colors.primary },
  toggleText: { fontSize: 15, fontWeight: 'bold', color: Theme.colors.secondaryForeground },
  toggleTextSelected: { color: WHITE },

  card: {
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: WHITE,
    overflow: 'hidden'
  },
  cardAccent: { borderLeftWidth: 4, borderLeftColor: Theme.colors.warningForeground },
  cardTight: { marginTop: 0 },

  orderCard: {
    marginHorizontal: 12,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: WHITE
  },
  orderCardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  orderCardTitle: { flex: 1, fontSize: 14, fontWeight: 'bold', color: Theme.colors.text },
  orderCardSubtitle: { fontSize: 11, color: Theme.colors.secondaryForeground, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: Theme.colors.warningBackground },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: Theme.colors.warningForeground },
  progressFillDone: { backgroundColor: Theme.colors.successForeground },
  progressLabel: { fontSize: 12, fontWeight: 'bold', color: Theme.colors.warningForeground, marginLeft: 10 },
  progressLabelDone: { color: Theme.colors.successForeground },
  bannerBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.colors.warningForeground,
    backgroundColor: Theme.colors.warningBackground
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Theme.colors.secondaryBackground
  },
  cardHeaderAccent: { backgroundColor: Theme.colors.warningBackground },
  cardHeaderIcon: { marginRight: 6 },
  cardHeaderTitle: { flex: 1, fontSize: 14, fontWeight: 'bold', color: Theme.colors.text },
  cardHeaderLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: Theme.colors.secondaryForeground
  },
  cardSubtitle: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontSize: 11,
    color: Theme.colors.secondaryForeground,
    backgroundColor: Theme.colors.secondaryBackground
  },
  cardSubtitleAccent: { backgroundColor: Theme.colors.warningBackground },
  hairline: { height: 1, backgroundColor: HAIRLINE },

  headerBlock: { backgroundColor: WHITE, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Theme.colors.text },
  headerSubtitle: { fontSize: 13, color: Theme.colors.secondaryForeground, marginTop: 4, lineHeight: 19 },
  listSurface: { backgroundColor: WHITE },

  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  rowSelected: { backgroundColor: SELECTED_ROW },
  rowMuted: { backgroundColor: Theme.colors.secondaryBackground },
  rowBody: { flex: 1, paddingRight: 10 },
  rowLeading: { marginRight: 8 },
  rowTitle: { fontSize: 14, fontWeight: 'bold', color: Theme.colors.text },
  rowTitleMuted: { color: Theme.colors.secondaryForeground, textDecorationLine: 'line-through' },
  rowSubtitle: { fontSize: 11, color: Theme.colors.secondaryForeground, marginTop: 2 },
  rowTitleLine: { flexDirection: 'row', alignItems: 'center' },
  rowMeta: { fontSize: 11, color: Theme.colors.secondaryForeground, marginLeft: 6 },
  rowTrailingAction: { fontSize: 15, fontWeight: 'bold', color: Theme.colors.primary, marginLeft: 12 },

  cardActionRow: { paddingHorizontal: 12, paddingVertical: 11, alignItems: 'center' },
  bannerText: { fontSize: 12, color: Theme.colors.warningForeground, lineHeight: 17 },
  bannerTextFill: { flex: 1, marginRight: 12 },
  retryButton: { marginHorizontal: 32, marginTop: 8 },
  movingItemsBlock: { backgroundColor: MOVING_BAND },
  movingOrderGroup: { paddingVertical: 6 },
  movingOrderDivider: { borderTopWidth: 1, borderTopColor: MOVING_DIVIDER },
  movingOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 2
  },
  movingOrderTitle: { flex: 1, fontSize: 12, fontWeight: 'bold', color: Theme.colors.text, marginRight: 8 },
  movingOrderMeta: { fontSize: 11, fontWeight: 'normal', color: Theme.colors.secondaryForeground },
  movingItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 3 },
  movingItemIndented: { paddingLeft: 28 },
  movingItemTitle: { flex: 1, fontSize: 12, color: Theme.colors.text, marginRight: 12 },
  movingItemCode: { color: Theme.colors.secondaryForeground },
  movingItemQty: { fontSize: 12, fontWeight: 'bold', color: Theme.colors.text },
  movingNote: { fontSize: 13, color: Theme.colors.secondaryForeground, paddingHorizontal: 12, paddingVertical: 10 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 4
  },
  pillNeutral: { backgroundColor: Theme.colors.secondaryBackground },
  pillWarning: { backgroundColor: Theme.colors.warningBackground },
  pillSuccess: { backgroundColor: Theme.colors.successBackground },
  pillInfo: { backgroundColor: Theme.colors.infoBackground },
  pillOutline: { backgroundColor: WHITE, borderWidth: 1, borderColor: HAIRLINE },
  pillIcon: { marginRight: 5 },
  pillText: { fontSize: 11, fontWeight: 'bold', color: Theme.colors.secondaryForeground },
  pillTextWarning: { color: Theme.colors.warningForeground, fontWeight: 'bold' },
  pillTextSuccess: { color: Theme.colors.successForeground, fontWeight: 'bold' },
  pillTextInfo: { color: Theme.colors.infoForeground, fontWeight: 'bold' },
  pillTextOutline: { color: Theme.colors.text, fontWeight: 'bold' },

  labelValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  labelValueLabel: { fontSize: 15, color: Theme.colors.secondaryForeground },
  labelValueValue: { fontSize: 15, fontWeight: 'bold', color: Theme.colors.text, marginLeft: 16, flexShrink: 1 },
  labelValueFill: { flex: 1, textAlign: 'right' },
  labelValueChevron: { marginLeft: 6, marginRight: -4 },

  screenTitle: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.text, marginHorizontal: 16, marginTop: 18 },
  screenSubtitle: {
    fontSize: 15,
    color: Theme.colors.secondaryForeground,
    marginHorizontal: 16,
    marginTop: 6,
    lineHeight: 21
  },
  helperText: { fontSize: 14, color: Theme.colors.secondaryForeground, marginHorizontal: 16, marginTop: 12 },
  sectionEmptyText: { fontSize: 14, color: Theme.colors.secondaryForeground, marginHorizontal: 16 },

  successBlock: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.successBackground
  },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: Theme.colors.text, marginTop: 14 },
  successText: {
    fontSize: 15,
    color: Theme.colors.secondaryForeground,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21
  },
  successTextStrong: { fontWeight: 'bold', color: Theme.colors.text },
  noteBox: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Theme.colors.secondaryBackground
  },
  noteText: { fontSize: 14, color: Theme.colors.secondaryForeground, lineHeight: 20 },

  actionBar: { padding: 16 },
  completeNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 14 },
  completeNoticeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.successForeground,
    marginLeft: 8,
    flexShrink: 1
  },
  completeNoticeNote: {
    fontSize: 12,
    color: Theme.colors.secondaryForeground,
    textAlign: 'center',
    lineHeight: 17,
    paddingBottom: 14
  },
  button: { minHeight: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonPrimary: { backgroundColor: Theme.colors.primary },
  buttonGhost: { backgroundColor: WHITE, borderWidth: 1, borderColor: HAIRLINE },
  buttonDisabled: { backgroundColor: Theme.colors.secondaryBackground, borderColor: HAIRLINE },
  buttonLabel: { fontSize: 15, fontWeight: 'bold', letterSpacing: 0.6 },
  buttonLabelPrimary: { color: WHITE },
  buttonLabelGhost: { color: Theme.colors.primary },
  buttonLabelDisabled: { color: Theme.colors.secondaryForeground },
  buttonSpacing: { marginTop: 12 },

  scannerRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12 },
  scannerInput: { flex: 1, marginRight: 10 }
});
