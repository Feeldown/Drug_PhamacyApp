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

// Import drug data
import drugData from '../data/drug_backup.json';

// API functions
export const getAllDrugs = (): DrugData[] => {
  return drugData;
};

export const searchDrugsByName = (query: string): DrugData[] => {
  const normalizedQuery = query.toLowerCase();
  return drugData.filter(
    (drug) =>
      drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
      drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByGenericName = (query: string): DrugData[] => {
  const normalizedQuery = query.toLowerCase();
  return drugData.filter((drug) =>
    drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByBrandName = (query: string): DrugData[] => {
  const normalizedQuery = query.toLowerCase();
  return drugData.filter((drug) =>
    drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const getDrugByBrandName = (brandName: string): DrugData | undefined => {
  return drugData.find(
    (drug) => drug.ชื่อการค้า.toLowerCase() === brandName.toLowerCase()
  );
};

export const getDrugByGenericName = (genericName: string): DrugData | undefined => {
  return drugData.find(
    (drug) => drug.ชื่อสามัญ.toLowerCase() === genericName.toLowerCase()
  );
};

export const getDrugsByForm = (form: string): DrugData[] => {
  const normalizedForm = form.toLowerCase();
  return drugData.filter(
    (drug) => drug.รูปแบบยา.toLowerCase().includes(normalizedForm)
  );
};

export const getDrugByName = (name: string): DrugData | undefined => {
  const normalizedName = name.toLowerCase();
  return drugData.find(
    (drug) =>
      drug.ชื่อการค้า.toLowerCase() === normalizedName ||
      drug.ชื่อสามัญ.toLowerCase() === normalizedName
  );
};

// Helper function to get unique drug forms with counts
export const getUniqueDrugForms = (): DrugForm[] => {
  const formCounts = drugData.reduce((acc, drug) => {
    const form = drug.รูปแบบยา;
    if (form) { // Ensure the form is not an empty string
      acc[form] = (acc[form] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(formCounts).map(([form, count]) => ({
    form,
    count,
  })).sort((a, b) => b.count - a.count); // Sort by count descending
};

// Enhanced search function that includes drug uses and side effects
export const searchDrugsEnhanced = (
  query: string,
  searchType: 'all' | 'generic' | 'brand' = 'all',
  drugList?: DrugData[]
): DrugData[] => {
  const normalizedQuery = query.toLowerCase();
  const list = drugList || drugData;
  switch (searchType) {
    case 'generic':
      return list.filter(drug => 
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    case 'brand':
      return list.filter(drug => 
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    default:
      return list.filter(drug =>
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
  }
};

// Get similar drugs based on form and uses
export const getSimilarDrugs = (currentDrug: DrugData, limit: number = 5): DrugData[] => {
  const sameFormDrugs = drugData.filter(
    (drug) =>
      drug.รูปแบบยา === currentDrug.รูปแบบยา &&
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า
  );

  // Get drugs with similar uses
  const similarUsesDrugs = drugData.filter(
    (drug) =>
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า &&
      drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(
        currentDrug['ยานี้ใช้สำหรับ'].toLowerCase().split(' ')[0]
      )
  );

  // Combine and deduplicate results
  const combined = [...sameFormDrugs, ...similarUsesDrugs];
  const unique = Array.from(new Map(combined.map(drug => [drug.ชื่อการค้า, drug])).values());
  
  return unique.slice(0, limit);
};

export const getDrugsByFormAsync = async (form: string): Promise<DrugData[]> => {
  const normalizedForm = form.toLowerCase();
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate API delay
  return drugData.filter(
    (drug) => drug.รูปแบบยา.toLowerCase() === normalizedForm
  );
}; 