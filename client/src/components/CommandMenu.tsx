import { Command, CommandItem } from 'cmdk'
import { useState,useEffect  } from 'react'

interface CommandProps{
  open: boolean;
  setOpen: (open: boolean) => void; 
  chats: Array<any>;
}

export const CommandMenu = (props: CommandProps) => {

  const [value,setValue] = useState('')


  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e : KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        props.setOpen(!props.open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const listchat = props.chats.map(chat => <CommandItem className='flex gap-2  hover:bg-[#efefef] px-2  flex items-center w-full h-[2.5rem] rounded-lg' key={chat.id}>
    <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" className="icon"><path d="M16.835 9.99968C16.8348 6.49038 13.8111 3.58171 10 3.58171C6.18893 3.58171 3.16523 6.49038 3.16504 9.99968C3.16504 11.4535 3.67943 12.7965 4.55273 13.8766C4.67524 14.0281 4.72534 14.2262 4.68945 14.4176C4.59391 14.9254 4.45927 15.4197 4.30469 15.904C4.93198 15.8203 5.5368 15.6959 6.12793 15.528L6.25391 15.5055C6.38088 15.4949 6.5091 15.5208 6.62305 15.5817C7.61731 16.1135 8.76917 16.4186 10 16.4186C13.8112 16.4186 16.835 13.5091 16.835 9.99968ZM18.165 9.99968C18.165 14.3143 14.4731 17.7487 10 17.7487C8.64395 17.7487 7.36288 17.4332 6.23438 16.8757C5.31485 17.118 4.36919 17.2694 3.37402 17.3307C3.14827 17.3446 2.93067 17.2426 2.79688 17.0602C2.66303 16.8778 2.63177 16.6396 2.71289 16.4284L2.91992 15.863C3.08238 15.3953 3.21908 14.9297 3.32227 14.4606C2.38719 13.2019 1.83496 11.6626 1.83496 9.99968C1.83515 5.68525 5.52703 2.25163 10 2.25163C14.473 2.25163 18.1649 5.68525 18.165 9.99968Z"></path></svg>
    <div className='overflow-hidden whitespace-nowrap text-ellipsis w-full'>
    {chat.prompt}
    </div>
    </CommandItem>)

  return (
    <Command.Dialog open={props.open} onOpenChange={props.setOpen} label="Global Command Menu" className='fixed inset-0 z-60 font-inter' onClick={() => props.setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className='bg-white rounded-xl overflow-hidden overflow-y-auto w-full mx-auto mt-40 shadow-md max-w-xl border-1 border-gray-300 z-60 max-h-[20rem]'>
      <Command.Input value={value} onValueChange={setValue} placeholder='Search chats...' className='border-b-1 border-gray-200 w-full outline-none h-[2.5rem] p-4'/>
      <Command.List className='px-4 py-2 overflow-y-auto'>
        <Command.Empty className=''>No results found for <span className='text-violet-500'>"{value}"</span>.</Command.Empty>

        <Command.Group heading="Chats" className='text-stone-400'>
          <ul className='text-black'>{listchat}</ul>
        </Command.Group>

      </Command.List>
      </div>
    </Command.Dialog>
  ) 
}