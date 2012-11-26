require 'compass'
Compass::Frameworks.register("sass-dic", :path => "#{File.dirname(__FILE__)}/..")

module Sass::Script::Functions
    
    def find hash, key
        hash.to_a.find do |pair|
            pair.to_a[0] == key
        end.to_a
    end

    def lookup(hash, key)
        require 'pp'
        item = hash.to_a.find do |pair|
            pp pair
            pair.to_a[0] == key
        end
        if not item.nil?
            if item.to_a.size > 0
                item.to_a[1]
            else
                Sass::Script::String.new ""
            end

        else
            Sass::Script::String.new ""
        end
    end
    declare :lookup, :args => [:list, :string]

    def insert(hash, key, value)
        a = hash.to_a.reject do |pair|
            pair.to_a[0] == key
        end
        a+= [Sass::Script::List.new([key, value], :space)]
        Sass::Script::List.new a, :space
    end
    declare :insert, :args => [:list, :key, :value]

    def keys(hash)
        keys = hash.to_a.map {|p| p.to_a[0]}
        Sass::Script::List.new keys, :space
    end
    declare :keys, :args => [:list]

    def values(hash)
        values = hash.to_a.map {|p| p.to_a[1]}
        Sass::Script::List.new values, :space
    end
    declare :values, :args => [:list]
end