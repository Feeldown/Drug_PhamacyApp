  import localDrugBackup from '../data/drug_backup.json';

// Drug data interfaces
export interface DrugData {
  ชื่อสามัญ: string;
  ชื่อการค้า: string;
  รูปแบบยา: string;
  "ยานี้ใช้สำหรับ": string;
  "วิธีการใช้ยา": string;
  "สิ่งที่ควรแจ้งให้แพทย์หรือเภสัชกรทราบ": string;
  "ทำอย่างไรหากลืมรับประทานยาหรือใช้ยา": string;
  "อาการไม่พึงประสงค์ทั่วไป": string;
  "อาการไม่พึงประสงค์ที่ต้องแจ้งแพทย์หรือเภสัชกรทันที": string;
  "การเก็บรักษายา": string;
  URL: string;
}

export interface DrugForm {
  form: string;
  count: number;
}

export const getAllDrugs = async (): Promise<DrugData[]> => {
  return localDrugBackup as DrugData[];
};

export const searchDrugsByName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter(
    (drug) =>
      drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
      drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByGenericName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter((drug) =>
    drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByBrandName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter((drug) =>
    drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const getDrugByBrandName = async (brandName: string): Promise<DrugData | undefined> => {
  const all = await getAllDrugs();
  return all.find(
    (drug) => drug.ชื่อการค้า.toLowerCase() === brandName.toLowerCase()
  );
};

export const getDrugByGenericName = async (genericName: string): Promise<DrugData | undefined> => {
  const all = await getAllDrugs();
  return all.find(
    (drug) => drug.ชื่อสามัญ.toLowerCase() === genericName.toLowerCase()
  );
};

export const getDrugsByForm = async (form: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedForm = form.toLowerCase();
  return all.filter(
    (drug) => drug.รูปแบบยา.toLowerCase().includes(normalizedForm)
  );
};

export const getDrugByName = async (name: string): Promise<DrugData | undefined> => {
  const normalized = name.trim().toLowerCase();
  // ค้นหาชื่อการค้า
  let found = (localDrugBackup as DrugData[]).find(drug =>
    drug.ชื่อการค้า.trim().toLowerCase() === normalized
  ) ||
  (localDrugBackup as DrugData[]).find(drug =>
    drug.ชื่อการค้า.replace(/\s+/g, '').toLowerCase() === normalized.replace(/\s+/g, '')
  );
  // ถ้าไม่เจอ ลองค้นหาชื่อสามัญ
  if (!found) {
    found = (localDrugBackup as DrugData[]).find(drug =>
      drug.ชื่อสามัญ.trim().toLowerCase() === normalized
    ) ||
    (localDrugBackup as DrugData[]).find(drug =>
      drug.ชื่อสามัญ.replace(/\s+/g, '').toLowerCase() === normalized.replace(/\s+/g, '')
    );
  }
  return found;
};

export const getUniqueDrugForms = async (): Promise<DrugForm[]> => {
  const all = localDrugBackup as DrugData[];
  const formMap: { [form: string]: number } = {};
  all.forEach(drug => {
    const form = drug.รูปแบบยา.trim();
    formMap[form] = (formMap[form] || 0) + 1;
  });
  return Object.entries(formMap).map(([form, count]) => ({ form, count }));
};

export const searchDrugsEnhanced = async (
  query: string,
  searchType: 'all' | 'generic' | 'brand' = 'all',
  drugList?: DrugData[]
): Promise<DrugData[]> => {
  const all = drugList || await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  switch (searchType) {
    case 'generic':
      return all.filter(drug => 
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    case 'brand':
      return all.filter(drug => 
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    default:
      return all.filter(drug =>
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
  }
};

export const getSimilarDrugs = async (currentDrug: DrugData, limit: number = 5): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const sameFormDrugs = all.filter(
    (drug) =>
      drug.รูปแบบยา === currentDrug.รูปแบบยา &&
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า
  );
  const similarUsesDrugs = all.filter(
    (drug) =>
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า &&
      drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(
        currentDrug['ยานี้ใช้สำหรับ'].toLowerCase().split(' ')[0]
      )
  );
  const combined = [...sameFormDrugs, ...similarUsesDrugs];
  const unique = Array.from(new Map(combined.map(drug => [drug.ชื่อการค้า, drug])).values());
  return unique.slice(0, limit);
};

export const getDrugsByFormAsync = async (form: string): Promise<DrugData[]> => {
  return getDrugsByForm(form);
}; 

// ค้นหายาแบบฉลาด: แยก keyword, ค้นหาทั้งชื่อสามัญ ชื่อการค้า และยานี้ใช้สำหรับ, เรียงตาม match count
export const searchDrugsSmart = async (query: string, drugList?: DrugData[]): Promise<DrugData[]> => {
  const all = drugList || await getAllDrugs();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const scored = all.map(drug => {
    const matchCount = keywords.reduce((acc, kw) => {
      if (
        drug.ชื่อสามัญ.toLowerCase().includes(kw) ||
        drug.ชื่อการค้า.toLowerCase().includes(kw) ||
        (drug['ยานี้ใช้สำหรับ'] && drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(kw))
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { drug, matchCount };
  });

  return scored
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(item => item.drug);
}; 