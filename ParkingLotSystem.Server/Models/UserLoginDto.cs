﻿using System.ComponentModel.DataAnnotations;

namespace ParkingLotSystem.Server.Models
{
    public class UserLoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
