export const ListNames = ["Week 0","Week 3","Week 5","Week 8","Week 10","Week 12.5","Week 14","Week 17","Week 20","Week 22","Week 23","Week 24","Week 25","Week 25.5","Week 26","Week 29","Week 30","Week 31","Week 34","Week 37"] as const
export type ListName = typeof ListNames[number]

export const ListUrls:Record<ListName,string> ={
    "Week 0": 'W0',
    "Week 3": 'W3',
    "Week 5": 'W5',
    "Week 8": 'W8',
    "Week 10": 'W10',
    "Week 12.5": 'W12.5',
    "Week 14": 'W14',
    "Week 17": 'W17',
    "Week 20": 'W20',
    "Week 22": 'W22',
    "Week 23": 'W23',
    "Week 24": 'W24',
    "Week 25": 'W25',
    "Week 25.5": 'W25.5',
    "Week 26": 'W26',
    "Week 29": 'W29',
    "Week 30": 'W30',
    "Week 31": 'W31',
    "Week 34": 'W34',
    "Week 37": "W37"
}