import { Items } from './Menu.types.ts'

export const headerMenuContent: Items[] = [
    {
        href: '/',
        menuItem: "TItle",
        image:'',
        submenu: [
            {
                item: [
                    {
                        item: 'Title',
                        href: '/',
                        highlight: true
                    }
                ],
                seeAll: true
            }
        ]
    }
]