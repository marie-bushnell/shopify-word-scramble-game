class Game
  def initialize
    @current_room = :dark_room
    @inventory = []
    @rooms = {
      dark_room: {
        description: "You're in a dark, musty room. Moonlight filters through a small window. There's a door to the north and east.",
        items: ["old_book"],
        exits: {
          north: :library,
          east: :kitchen
        }
      },
      library: {
        description: "Dusty bookshelves line the walls. A mysterious chest sits in the corner. There's a door to the south and east.",
        items: ["rusty_key"],
        exits: {
          south: :dark_room,
          east: :study
        }
      },
      study: {
        description: "An antique desk dominates this cozy room. Papers are scattered everywhere. There are doors to the west and south.",
        items: ["letter"],
        exits: {
          west: :library,
          south: :kitchen
        }
      },
      kitchen: {
        description: "An old kitchen with a locked exit door. The air smells of ancient spices. There are doors to the west and north.",
        items: [],
        exits: {
          west: :dark_room,
          north: :study
        },
        locked_exit: true
      }
    }
  end

  def play
    puts "\nWelcome to the Mysterious Manor!"
    puts "\nYou wake up in a strange room..."
    look

    loop do
      show_options
      print "> "
      choice = gets.chomp

      case choice
      when "1"
        puts "\nYou panic for a moment, but then take a deep breath. Maybe that wasn't so helpful..."
      when "2"
        look
      when "3"
        show_inventory
      when "4"
        handle_movement
      when "5"
        handle_take_item
      when "6"
        puts "Thanks for playing!"
        break
      else
        puts "Please choose a number between 1 and 6."
      end

      if @current_room == :kitchen && @inventory.include?("rusty_key")
        puts "\nCongratulations! You've found the key and escaped the manor!"
        break
      end
    end
  end

  private

  def show_options
    puts "\nWhat would you like to do?"
    puts "1 - Panic!"
    puts "2 - Look around"
    puts "3 - Check inventory"
    puts "4 - Move to another room"
    puts "5 - Take an item"
    puts "6 - Give up and quit"
  end

  def handle_movement
    room = @rooms[@current_room]
    puts "\nWhich direction would you like to go?"
    available_exits = room[:exits].keys
    available_exits.each_with_index do |direction, index|
      puts "#{index + 1} - Go #{direction}"
    end
    print "> "
    choice = gets.chomp.to_i - 1

    if choice >= 0 && choice < available_exits.length
      direction = available_exits[choice]
      move(direction)
    else
      puts "Invalid choice. Please try again."
    end
  end

  def handle_take_item
    room = @rooms[@current_room]
    if room[:items].empty?
      puts "There's nothing here to take."
      return
    end

    puts "\nWhat would you like to take?"
    room[:items].each_with_index do |item, index|
      puts "#{index + 1} - #{item}"
    end
    print "> "
    choice = gets.chomp.to_i - 1

    if choice >= 0 && choice < room[:items].length
      item = room[:items][choice]
      take(item)
    else
      puts "Invalid choice. Please try again."
    end
  end

  def look
    room = @rooms[@current_room]
    puts "\n#{room[:description]}"
    unless room[:items].empty?
      puts "You can see: #{room[:items].join(", ")}"
    end
  end

  def move(direction)
    room = @rooms[@current_room]
    if room[:exits][direction]
      if room[:locked_exit] && direction == :north && !@inventory.include?("rusty_key")
        puts "The door is locked. You need a key to open it."
      else
        @current_room = room[:exits][direction]
        look
      end
    else
      puts "You can't go that way."
    end
  end

  def take(item)
    room = @rooms[@current_room]
    if room[:items].include?(item)
      @inventory << item
      room[:items].delete(item)
      puts "You took the #{item}."
    else
      puts "I don't see that here."
    end
  end

  def show_inventory
    if @inventory.empty?
      puts "You're not carrying anything."
    else
      puts "You're carrying: #{@inventory.join(", ")}"
    end
  end
end

# Start the game
if __FILE__ == $0
  game = Game.new
  game.play
end
