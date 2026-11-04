import type { District, DistrictId } from '../types';

export const DISTRICTS: District[] = [
  {
    id: 'teknoloji',
    name: 'Teknoloji Merkezi',
    shortName: 'Teknoloji',
    outcome: 'BTY.5.1.1',
    description: 'Günlük yaşamda kullanılan bilişim teknolojilerini keşfet ve sınıflandır.',
    color: '#06b6d4',
    dark: '#0e7490',
    light: '#cffafe',
    icon: 'chip',
  },
  {
    id: 'toplum',
    name: 'Toplum Meydanı',
    shortName: 'Toplum',
    outcome: 'BTY.5.1.2',
    description: 'Bilişim teknolojilerinin bireye ve topluma etkilerini birlikte düşün.',
    color: '#f97316',
    dark: '#c2410c',
    light: '#ffedd5',
    icon: 'people',
  },
  {
    id: 'guvenlik',
    name: 'Dijital Güvenlik Merkezi',
    shortName: 'Güvenlik',
    outcome: 'BTY.5.1.3',
    description: 'Dijital vatandaşlık uygulamalarını öğren, kendini ve arkadaşlarını koru.',
    color: '#3b82f6',
    dark: '#1d4ed8',
    light: '#dbeafe',
    icon: 'shield',
  },
  {
    id: 'yapayzeka',
    name: 'Yapay Zekâ Laboratuvarı',
    shortName: 'Yapay Zekâ',
    outcome: 'BTY.5.1.4',
    description: 'Yapay zekânın temel kavramlarını sorgula ve günlük hayattaki yerini gör.',
    color: '#8b5cf6',
    dark: '#6d28d9',
    light: '#ede9fe',
    icon: 'brain',
  },
  {
    id: 'atolye',
    name: 'Bilgisayar Atölyesi',
    shortName: 'Atölye',
    outcome: 'BTY.5.1.5',
    description: 'Bilgisayarın parçalarını çözümle; donanım ve yazılımı ayırt et.',
    color: '#eab308',
    dark: '#a16207',
    light: '#fef9c3',
    icon: 'computer',
  },
  {
    id: 'dosya',
    name: 'Dosya Yönetim Merkezi',
    shortName: 'Dosyalar',
    outcome: 'BTY.5.1.6',
    description: 'Dosya ve klasörlerle çalış; düzenli ve güvenli bir dijital çanta oluştur.',
    color: '#22c55e',
    dark: '#15803d',
    light: '#dcfce7',
    icon: 'folder',
  },
];

export const DISTRICT_BY_ID: Record<DistrictId, District> = DISTRICTS.reduce(
  (acc, district) => {
    acc[district.id] = district;
    return acc;
  },
  {} as Record<DistrictId, District>,
);
